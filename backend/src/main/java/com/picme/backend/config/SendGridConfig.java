package com.picme.backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * SendGrid設定
 * 環境変数からAPIキーを読み込み
 */
@Configuration
@Getter
public class SendGridConfig {

    @Value("${sendgrid.api-key:}")
    private String apiKey;

    @Value("${sendgrid.from-email:noreply@picme.com}")
    private String fromEmail;

    @Value("${sendgrid.from-name:PicMe}")
    private String fromName;

    @Value("${app.frontend-url:http://localhost:3001}")
    private String frontendUrl;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }
}
