package com.picme.backend.controller;

import com.picme.backend.dto.request.CheckoutRequest;
import com.picme.backend.dto.response.CheckoutResponse;
import com.picme.backend.dto.response.SubscriptionResponse;
import com.picme.backend.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * サブスクリプション管理コントローラー
 */
@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /**
     * 現在のサブスクリプション状態を取得
     */
    @GetMapping("/status")
    public ResponseEntity<SubscriptionResponse> getSubscriptionStatus(
            @AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(subscriptionService.getSubscription(email));
    }

    /**
     * Stripe Checkoutセッションを作成
     */
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckoutSession(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CheckoutRequest request) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(subscriptionService.createCheckoutSession(email, request));
    }

    /**
     * サブスクリプションをキャンセル（期間終了時）
     */
    @PostMapping("/cancel")
    public ResponseEntity<SubscriptionResponse> cancelSubscription(
            @AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(subscriptionService.cancelSubscription(email));
    }

    /**
     * キャンセル予定のサブスクリプションを再開
     */
    @PostMapping("/resume")
    public ResponseEntity<SubscriptionResponse> resumeSubscription(
            @AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok(subscriptionService.resumeSubscription(email));
    }

    /**
     * Stripe Webhookエンドポイント
     * 認証不要（Stripe署名で検証）
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        log.debug("Received Stripe webhook");
        subscriptionService.handleWebhookEvent(payload, signature);
        return ResponseEntity.ok("OK");
    }
}
