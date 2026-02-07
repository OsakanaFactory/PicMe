package com.picme.backend.controller;

import com.picme.backend.dto.request.*;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.AuthResponse;
import com.picme.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 認証コントローラー
 * ユーザー登録、ログイン、ログアウト、トークンリフレッシュを処理
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * ユーザー登録
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request received for: {}", request.getEmail());

        AuthResponse response = authService.signup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * ログイン
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for: {}", request.getEmail());

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * ログアウト
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        authService.logout(token);

        return ResponseEntity.ok(ApiResponse.success("ログアウトしました"));
    }

    /**
     * トークンリフレッシュ
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        log.info("Token refresh request received");

        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    /**
     * メール認証
     * GET /api/auth/verify?token=xxx
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        log.info("Email verification request received");
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("メールアドレスを認証しました"));
    }

    /**
     * パスワードリセットリクエスト
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password request for: {}", request.getEmail());
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("パスワードリセットメールを送信しました"));
    }

    /**
     * パスワードリセット実行
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        log.info("Password reset request received");
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("パスワードを変更しました"));
    }

    /**
     * 認証メール再送
     * POST /api/auth/resend-verification
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request) {
        log.info("Resend verification request for: {}", request.getEmail());
        authService.resendVerification(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("認証メールを再送しました"));
    }
}
