package com.picme.backend.service.impl;

import com.picme.backend.dto.request.LoginRequest;
import com.picme.backend.dto.request.RefreshTokenRequest;
import com.picme.backend.dto.request.SignupRequest;
import com.picme.backend.dto.response.AuthResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.Profile;
import com.picme.backend.model.User;
import com.picme.backend.repository.ProfileRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.security.JwtTokenProvider;
import com.picme.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
