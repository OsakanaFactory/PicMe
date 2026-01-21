package com.picme.backend.controller;

import com.picme.backend.dto.request.LoginRequest;
import com.picme.backend.dto.request.RefreshTokenRequest;
import com.picme.backend.dto.request.SignupRequest;
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
}
