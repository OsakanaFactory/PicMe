package com.picme.backend.controller;

import com.picme.backend.dto.request.AdminLoginRequest;
import com.picme.backend.dto.response.AdminLoginResponse;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.service.AdminAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 管理者認証コントローラー
 */
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    /**
     * 管理者ログイン
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminLoginResponse>> login(
            @Valid @RequestBody AdminLoginRequest request) {
        AdminLoginResponse response = adminAuthService.login(request);
        return ResponseEntity.ok(ApiResponse.success("ログインしました", response));
    }

    /**
     * トークンリフレッシュ
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AdminLoginResponse.TokenDto>> refreshToken(
            @RequestHeader("Authorization") String authHeader) {
        String refreshToken = authHeader.replace("Bearer ", "");
        AdminLoginResponse.TokenDto tokens = adminAuthService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("トークンを更新しました", tokens));
    }
}
