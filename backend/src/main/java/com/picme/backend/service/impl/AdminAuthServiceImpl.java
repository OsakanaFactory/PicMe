package com.picme.backend.service.impl;

import com.picme.backend.dto.request.AdminLoginRequest;
import com.picme.backend.dto.response.AdminLoginResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.AdminUser;
import com.picme.backend.repository.AdminUserRepository;
import com.picme.backend.security.JwtTokenProvider;
import com.picme.backend.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 管理者認証サービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAuthServiceImpl implements AdminAuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AdminLoginResponse login(AdminLoginRequest request) {
        AdminUser admin = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> ApiException.unauthorized("メールアドレスまたはパスワードが正しくありません"));

        if (!admin.getIsActive()) {
            throw ApiException.forbidden("このアカウントは無効化されています");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw ApiException.unauthorized("メールアドレスまたはパスワードが正しくありません");
        }

        // 最終ログイン日時を更新
        admin.setLastLoginAt(LocalDateTime.now());
        adminUserRepository.save(admin);

        // トークン生成
        String accessToken = jwtTokenProvider.generateAdminAccessToken(admin.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(admin.getEmail());

        log.info("管理者ログイン成功: {}", admin.getEmail());

        return AdminLoginResponse.builder()
                .admin(AdminLoginResponse.AdminUserDto.builder()
                        .id(admin.getId())
                        .username(admin.getUsername())
                        .email(admin.getEmail())
                        .role(admin.getRole())
                        .build())
                .tokens(AdminLoginResponse.TokenDto.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                        .build())
                .build();
    }

    @Override
    public AdminLoginResponse.TokenDto refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw ApiException.unauthorized("リフレッシュトークンが無効です");
        }

        if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw ApiException.unauthorized("無効なトークンタイプです");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        AdminUser admin = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("管理者が見つかりません"));

        if (!admin.getIsActive()) {
            throw ApiException.forbidden("このアカウントは無効化されています");
        }

        String newAccessToken = jwtTokenProvider.generateAdminAccessToken(email);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        return AdminLoginResponse.TokenDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                .build();
    }
}
