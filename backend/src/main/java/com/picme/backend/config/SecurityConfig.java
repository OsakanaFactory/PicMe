package com.picme.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                // 公開エンドポイント（認証不要）
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/users/check-username").permitAll()
                // その他は認証が必要
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable()) // 開発環境ではCSRFを無効化
            .cors(cors -> cors.disable()); // 開発環境ではCORSを無効化（後で設定）

        return http.build();
    }
}
