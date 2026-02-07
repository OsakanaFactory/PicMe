package com.picme.backend.service.impl;

import com.picme.backend.dto.request.LoginRequest;
import com.picme.backend.dto.request.RefreshTokenRequest;
import com.picme.backend.dto.request.SignupRequest;
import com.picme.backend.dto.response.AuthResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.PasswordResetToken;
import com.picme.backend.model.Profile;
import com.picme.backend.model.User;
import com.picme.backend.model.VerificationToken;
import com.picme.backend.repository.PasswordResetTokenRepository;
import com.picme.backend.repository.ProfileRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.repository.VerificationTokenRepository;
import com.picme.backend.security.JwtTokenProvider;
import com.picme.backend.service.AuthService;
import com.picme.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 認証サービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("New user signup: {}", request.getEmail());

        // ユーザー名の重複チェック
        if (userRepository.existsByUsername(request.getUsername())) {
            throw ApiException.usernameAlreadyExists();
        }

        // メールアドレスの重複チェック
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.emailAlreadyExists();
        }

        // ユーザー作成
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);

        // プロフィール作成
        Profile profile = Profile.builder()
                .user(user)
                .displayName(request.getUsername())
                .build();

        profileRepository.save(profile);

        // メール認証トークン生成・送信
        sendVerificationToken(user);

        // トークン生成
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        log.info("User registered successfully: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken, "アカウントを作成しました");
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getEmail());

        // 認証
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        // ユーザー取得
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(ApiException::invalidCredentials);

        // アカウント有効性チェック
        if (!user.getIsActive()) {
            throw ApiException.accountDisabled();
        }

        // トークン生成
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        log.info("User logged in successfully: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken, "ログインしました");
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        // リフレッシュトークンの検証
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw ApiException.invalidToken();
        }

        if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw ApiException.invalidToken();
        }

        // ユーザー取得
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        // 新しいトークン生成
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        log.info("Token refreshed for user: {}", user.getEmail());

        return buildAuthResponse(user, newAccessToken, newRefreshToken, "トークンを更新しました");
    }

    @Override
    public void logout(String token) {
        // 現在はステートレスなJWTを使用しているため、
        // クライアント側でトークンを削除するだけ
        // 将来的にはトークンブラックリストを実装予定
        log.info("User logged out");
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByTokenAndUsedFalse(token)
                .orElseThrow(() -> ApiException.badRequest("無効な認証トークンです"));

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("認証トークンの有効期限が切れています。再送してください。");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        log.info("Email verified for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        // ユーザーが存在しなくても成功レスポンスを返す（セキュリティ上）
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .build();
            passwordResetTokenRepository.save(resetToken);

            emailService.sendPasswordResetEmail(user.getEmail(), token);
            log.info("Password reset email sent to: {}", user.getEmail());
        });
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedFalse(token)
                .orElseThrow(() -> ApiException.badRequest("無効なリセットトークンです"));

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("リセットトークンの有効期限が切れています。再度リクエストしてください。");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        if (user.getEmailVerified()) {
            throw ApiException.badRequest("このメールアドレスは既に認証済みです");
        }

        sendVerificationToken(user);
        log.info("Verification email resent to: {}", user.getEmail());
    }

    /**
     * メール認証トークンを生成して送信
     */
    private void sendVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    /**
     * 認証レスポンスを構築
     */
    private AuthResponse buildAuthResponse(
            User user,
            String accessToken,
            String refreshToken,
            String message) {

        return AuthResponse.builder()
                .success(true)
                .message(message)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .emailVerified(user.getEmailVerified())
                        .planType(user.getPlanType())
                        .build())
                .tokens(AuthResponse.TokenDto.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                        .build())
                .build();
    }
}
