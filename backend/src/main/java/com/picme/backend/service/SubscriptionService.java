package com.picme.backend.service;

import com.picme.backend.dto.request.CheckoutRequest;
import com.picme.backend.dto.response.CheckoutResponse;
import com.picme.backend.dto.response.SubscriptionResponse;
import com.picme.backend.model.PlanType;

/**
 * サブスクリプションサービスインターフェース
 */
public interface SubscriptionService {

    /**
     * サブスクリプション状態を取得
     */
    SubscriptionResponse getSubscription(String email);

    /**
     * Stripe Checkoutセッションを作成
     */
    CheckoutResponse createCheckoutSession(String email, CheckoutRequest request);

    /**
     * サブスクリプションをキャンセル
     */
    SubscriptionResponse cancelSubscription(String email);

    /**
     * サブスクリプションを再開
     */
    SubscriptionResponse resumeSubscription(String email);

    /**
     * Stripe Webhookイベントを処理
     */
    void handleWebhookEvent(String payload, String signature);

    /**
     * ユーザーのプランタイプを取得
     */
    PlanType getUserPlanType(Long userId);
}
