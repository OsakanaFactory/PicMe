package com.picme.backend.service.impl;

import com.picme.backend.config.StripeConfig;
import com.picme.backend.dto.request.CheckoutRequest;
import com.picme.backend.dto.response.CheckoutResponse;
import com.picme.backend.dto.response.SubscriptionResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.Subscription;
import com.picme.backend.model.SubscriptionStatus;
import com.picme.backend.model.User;
import com.picme.backend.repository.SubscriptionRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.SubscriptionService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * サブスクリプションサービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final StripeConfig stripeConfig;

    @Override
    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscription(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        // Stripe未設定かつサブスクリプション未登録の場合はデフォルトFREEレスポンスを返却
        Subscription subscription = subscriptionRepository.findByUserId(user.getId())
                .orElse(null);

        if (!stripeConfig.isConfigured() && subscription == null) {
            PlanType fallbackPlan = user.getPlanType() != null ? user.getPlanType() : PlanType.FREE;
            return SubscriptionResponse.builder()
                    .success(true)
                    .data(SubscriptionResponse.SubscriptionDto.builder()
                            .planType(fallbackPlan)
                            .status(SubscriptionStatus.ACTIVE)
                            .cancelAtPeriodEnd(false)
                            .limits(getPlanLimits(fallbackPlan))
                            .build())
                    .build();
        }

        PlanType planType = subscription != null ? subscription.getPlanType() : user.getPlanType();
        SubscriptionStatus status = subscription != null ? subscription.getStatus() : SubscriptionStatus.ACTIVE;

        return SubscriptionResponse.builder()
                .success(true)
                .data(SubscriptionResponse.SubscriptionDto.builder()
                        .planType(planType)
                        .status(status)
                        .currentPeriodStart(subscription != null ? subscription.getCurrentPeriodStart() : null)
                        .currentPeriodEnd(subscription != null ? subscription.getCurrentPeriodEnd() : null)
                        .cancelAtPeriodEnd(subscription != null && subscription.getCancelAtPeriodEnd())
                        .limits(getPlanLimits(planType))
                        .build())
                .build();
    }

    @Override
    @Transactional
    public CheckoutResponse createCheckoutSession(String email, CheckoutRequest request) {
        if (!stripeConfig.isConfigured()) {
            throw ApiException.badRequest("Stripe is not configured");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        String priceId = getPriceIdForPlan(request.getPlanType());
        if (priceId == null || priceId.isEmpty()) {
            throw ApiException.badRequest("Price not configured for plan: " + request.getPlanType());
        }

        try {
            // 既存のStripe顧客IDを取得、なければ新規作成
            String customerId = getOrCreateStripeCustomer(user);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setCustomer(customerId)
                    .setSuccessUrl(stripeConfig.getFrontendUrl() + "/dashboard?subscription=success")
                    .setCancelUrl(stripeConfig.getFrontendUrl() + "/dashboard/upgrade?canceled=true")
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPrice(priceId)
                            .setQuantity(1L)
                            .build())
                    .putMetadata("user_id", user.getId().toString())
                    .putMetadata("plan_type", request.getPlanType().name())
                    .build();

            Session session = Session.create(params);

            log.info("Created checkout session for user {}: {}", user.getEmail(), session.getId());

            return CheckoutResponse.builder()
                    .success(true)
                    .sessionId(session.getId())
                    .checkoutUrl(session.getUrl())
                    .build();

        } catch (StripeException e) {
            log.error("Failed to create checkout session: {}", e.getMessage());
            throw ApiException.badRequest("Failed to create checkout session: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public SubscriptionResponse cancelSubscription(String email) {
        if (!stripeConfig.isConfigured()) {
            throw ApiException.badRequest("Stripe is not configured");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        Subscription subscription = subscriptionRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.badRequest("No active subscription found"));

        if (subscription.getStripeSubscriptionId() == null) {
            throw ApiException.badRequest("No Stripe subscription found");
        }

        try {
            com.stripe.model.Subscription stripeSubscription =
                    com.stripe.model.Subscription.retrieve(subscription.getStripeSubscriptionId());

            // 期間終了時にキャンセル
            stripeSubscription.update(
                    com.stripe.param.SubscriptionUpdateParams.builder()
                            .setCancelAtPeriodEnd(true)
                            .build()
            );

            subscription.setCancelAtPeriodEnd(true);
            subscriptionRepository.save(subscription);

            log.info("Subscription canceled at period end for user: {}", user.getEmail());

            return getSubscription(email);

        } catch (StripeException e) {
            log.error("Failed to cancel subscription: {}", e.getMessage());
            throw ApiException.badRequest("Failed to cancel subscription: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public SubscriptionResponse resumeSubscription(String email) {
        if (!stripeConfig.isConfigured()) {
            throw ApiException.badRequest("Stripe is not configured");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        Subscription subscription = subscriptionRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.badRequest("No subscription found"));

        if (!subscription.getCancelAtPeriodEnd()) {
            throw ApiException.badRequest("Subscription is not scheduled for cancellation");
        }

        try {
            com.stripe.model.Subscription stripeSubscription =
                    com.stripe.model.Subscription.retrieve(subscription.getStripeSubscriptionId());

            stripeSubscription.update(
                    com.stripe.param.SubscriptionUpdateParams.builder()
                            .setCancelAtPeriodEnd(false)
                            .build()
            );

            subscription.setCancelAtPeriodEnd(false);
            subscriptionRepository.save(subscription);

            log.info("Subscription resumed for user: {}", user.getEmail());

            return getSubscription(email);

        } catch (StripeException e) {
            log.error("Failed to resume subscription: {}", e.getMessage());
            throw ApiException.badRequest("Failed to resume subscription: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleWebhookEvent(String payload, String signature) {
        if (!stripeConfig.isConfigured()) {
            log.warn("Stripe webhook received but Stripe is not configured");
            return;
        }

        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, stripeConfig.getWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.error("Invalid webhook signature");
            throw ApiException.badRequest("Invalid webhook signature");
        }

        log.info("Processing Stripe webhook event: {}", event.getType());

        switch (event.getType()) {
            case "checkout.session.completed" -> handleCheckoutCompleted(event);
            case "customer.subscription.updated" -> handleSubscriptionUpdated(event);
            case "customer.subscription.deleted" -> handleSubscriptionDeleted(event);
            case "invoice.payment_succeeded" -> handlePaymentSucceeded(event);
            case "invoice.payment_failed" -> handlePaymentFailed(event);
            default -> log.debug("Unhandled event type: {}", event.getType());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PlanType getUserPlanType(Long userId) {
        return subscriptionRepository.findByUserId(userId)
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE || s.getStatus() == SubscriptionStatus.TRIALING)
                .map(Subscription::getPlanType)
                .orElseGet(() -> userRepository.findById(userId)
                        .map(User::getPlanType)
                        .orElse(PlanType.FREE));
    }

    // === Private Helper Methods ===

    private String getOrCreateStripeCustomer(User user) throws StripeException {
        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElse(null);

        if (subscription != null && subscription.getStripeCustomerId() != null) {
            return subscription.getStripeCustomerId();
        }

        // 新しいStripe顧客を作成
        Customer customer = Customer.create(
                com.stripe.param.CustomerCreateParams.builder()
                        .setEmail(user.getEmail())
                        .putMetadata("user_id", user.getId().toString())
                        .build()
        );

        // サブスクリプションレコードを作成または更新
        if (subscription == null) {
            subscription = Subscription.builder()
                    .user(user)
                    .planType(PlanType.FREE)
                    .status(SubscriptionStatus.ACTIVE)
                    .stripeCustomerId(customer.getId())
                    .build();
        } else {
            subscription.setStripeCustomerId(customer.getId());
        }
        subscriptionRepository.save(subscription);

        return customer.getId();
    }

    private String getPriceIdForPlan(PlanType planType) {
        return switch (planType) {
            case STARTER -> stripeConfig.getPriceIdStarter();
            case PRO -> stripeConfig.getPriceIdPro();
            case STUDIO -> stripeConfig.getPriceIdStudio();
            default -> null;
        };
    }

    private SubscriptionResponse.PlanLimits getPlanLimits(PlanType planType) {
        return switch (planType) {
            case FREE -> SubscriptionResponse.PlanLimits.builder()
                    .maxArtworks(5)
                    .maxSocialLinks(2)
                    .maxPosts(1)
                    .maxCategories(0)
                    .maxStorageMb(300)
                    .hasAds(true)
                    .build();
            case STARTER -> SubscriptionResponse.PlanLimits.builder()
                    .maxArtworks(20)
                    .maxSocialLinks(5)
                    .maxPosts(5)
                    .maxCategories(0)
                    .maxStorageMb(1024)
                    .hasAds(false)
                    .build();
            case PRO -> SubscriptionResponse.PlanLimits.builder()
                    .maxArtworks(50)
                    .maxSocialLinks(10)
                    .maxPosts(20)
                    .maxCategories(5)
                    .maxStorageMb(2048)
                    .hasAds(false)
                    .build();
            case STUDIO -> SubscriptionResponse.PlanLimits.builder()
                    .maxArtworks(200)
                    .maxSocialLinks(Integer.MAX_VALUE)
                    .maxPosts(Integer.MAX_VALUE)
                    .maxCategories(Integer.MAX_VALUE)
                    .maxStorageMb(10240)
                    .hasAds(false)
                    .build();
        };
    }

    private void handleCheckoutCompleted(Event event) {
        Session session = deserializeEventData(event, Session.class);

        if (session == null) {
            log.error("Failed to deserialize checkout session from event");
            return;
        }

        String userId = session.getMetadata().get("user_id");
        String planTypeStr = session.getMetadata().get("plan_type");

        if (userId == null || planTypeStr == null) {
            log.error("Missing metadata in checkout session");
            return;
        }

        User user = userRepository.findById(Long.parseLong(userId)).orElse(null);
        if (user == null) {
            log.error("User not found: {}", userId);
            return;
        }

        PlanType planType = PlanType.valueOf(planTypeStr);

        Subscription subscription = subscriptionRepository.findByUserId(user.getId())
                .orElse(Subscription.builder().user(user).build());

        subscription.setPlanType(planType);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStripeCustomerId(session.getCustomer());
        subscription.setStripeSubscriptionId(session.getSubscription());

        subscriptionRepository.save(subscription);

        // ユーザーのプランタイプも更新
        user.setPlanType(planType);
        userRepository.save(user);

        log.info("Checkout completed for user {}: plan={}", user.getEmail(), planType);
    }

    private void handleSubscriptionUpdated(Event event) {
        com.stripe.model.Subscription stripeSubscription =
                deserializeEventData(event, com.stripe.model.Subscription.class);

        if (stripeSubscription == null) {
            log.error("Failed to deserialize subscription from event");
            return;
        }

        Subscription subscription = subscriptionRepository
                .findByStripeSubscriptionId(stripeSubscription.getId())
                .orElse(null);

        if (subscription == null) {
            log.warn("Subscription not found: {}", stripeSubscription.getId());
            return;
        }

        subscription.setStatus(mapStripeStatus(stripeSubscription.getStatus()));
        subscription.setCancelAtPeriodEnd(stripeSubscription.getCancelAtPeriodEnd());
        subscription.setCurrentPeriodStart(toLocalDateTime(stripeSubscription.getCurrentPeriodStart()));
        subscription.setCurrentPeriodEnd(toLocalDateTime(stripeSubscription.getCurrentPeriodEnd()));

        subscriptionRepository.save(subscription);

        log.info("Subscription updated: {}", stripeSubscription.getId());
    }

    private void handleSubscriptionDeleted(Event event) {
        com.stripe.model.Subscription stripeSubscription =
                deserializeEventData(event, com.stripe.model.Subscription.class);

        if (stripeSubscription == null) {
            log.error("Failed to deserialize subscription from event");
            return;
        }

        Subscription subscription = subscriptionRepository
                .findByStripeSubscriptionId(stripeSubscription.getId())
                .orElse(null);

        if (subscription == null) return;

        subscription.setStatus(SubscriptionStatus.CANCELED);
        subscription.setPlanType(PlanType.FREE);
        subscriptionRepository.save(subscription);

        // ユーザーのプランタイプもFREEに戻す
        User user = subscription.getUser();
        user.setPlanType(PlanType.FREE);
        userRepository.save(user);

        log.info("Subscription deleted for user: {}", user.getEmail());
    }

    private void handlePaymentSucceeded(Event event) {
        Invoice invoice = deserializeEventData(event, Invoice.class);

        if (invoice == null) {
            log.error("Failed to deserialize invoice from event");
            return;
        }

        log.info("Payment succeeded for invoice: {}", invoice.getId());
    }

    private void handlePaymentFailed(Event event) {
        Invoice invoice = deserializeEventData(event, Invoice.class);

        if (invoice == null) {
            log.error("Failed to deserialize invoice from event");
            return;
        }

        Subscription subscription = subscriptionRepository
                .findByStripeCustomerId(invoice.getCustomer())
                .orElse(null);

        if (subscription != null) {
            subscription.setStatus(SubscriptionStatus.PAST_DUE);
            subscriptionRepository.save(subscription);
        }

        log.warn("Payment failed for invoice: {}", invoice.getId());
    }

    private SubscriptionStatus mapStripeStatus(String stripeStatus) {
        return switch (stripeStatus) {
            case "active" -> SubscriptionStatus.ACTIVE;
            case "past_due" -> SubscriptionStatus.PAST_DUE;
            case "canceled" -> SubscriptionStatus.CANCELED;
            case "incomplete" -> SubscriptionStatus.INCOMPLETE;
            case "trialing" -> SubscriptionStatus.TRIALING;
            default -> SubscriptionStatus.ACTIVE;
        };
    }

    /**
     * Stripe SDKバージョンとWebhook APIバージョンが不一致の場合、
     * getObject()が空を返す。deserializeUnsafe()でフォールバックする。
     */
    @SuppressWarnings("unchecked")
    private <T extends StripeObject> T deserializeEventData(Event event, Class<T> clazz) {
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();

        // まず安全なデシリアライゼーションを試行
        T obj = (T) deserializer.getObject().orElse(null);
        if (obj != null) return obj;

        // APIバージョン不一致の場合、unsafe デシリアライゼーションにフォールバック
        try {
            log.warn("Stripe API version mismatch, using unsafe deserialization for event: {}", event.getType());
            StripeObject unsafeObj = deserializer.deserializeUnsafe();
            if (clazz.isInstance(unsafeObj)) {
                return clazz.cast(unsafeObj);
            }
            log.error("Deserialized object type mismatch: expected={}, actual={}",
                    clazz.getSimpleName(), unsafeObj.getClass().getSimpleName());
        } catch (Exception e) {
            log.error("Failed to deserialize event data for {}: {}", event.getType(), e.getMessage());
        }
        return null;
    }

    private LocalDateTime toLocalDateTime(Long timestamp) {
        if (timestamp == null) return null;
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(timestamp), ZoneId.systemDefault());
    }
}
