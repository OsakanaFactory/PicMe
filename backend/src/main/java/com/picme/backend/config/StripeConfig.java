package com.picme.backend.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Stripe設定
 * 環境変数からAPIキーを読み込み、Stripeを初期化
 */
@Configuration
@Getter
public class StripeConfig {

    @Value("${stripe.api-key:}")
    private String apiKey;

    @Value("${stripe.webhook-secret:}")
    private String webhookSecret;

    @Value("${stripe.price.starter:}")
    private String priceIdStarter;

    @Value("${stripe.price.pro:}")
    private String priceIdPro;

    @Value("${stripe.price.studio:}")
    private String priceIdStudio;

    @Value("${app.frontend-url:http://localhost:3001}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        if (apiKey != null && !apiKey.isEmpty()) {
            Stripe.apiKey = apiKey;
        }
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }
}
