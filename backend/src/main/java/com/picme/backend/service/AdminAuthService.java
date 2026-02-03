package com.picme.backend.service;

import com.picme.backend.dto.request.AdminLoginRequest;
import com.picme.backend.dto.response.AdminLoginResponse;

/**
 * 管理者認証サービスインターフェース
 */
public interface AdminAuthService {

    /**
     * 管理者ログイン
     */
    AdminLoginResponse login(AdminLoginRequest request);

    /**
     * 管理者トークンリフレッシュ
     */
    AdminLoginResponse.TokenDto refreshToken(String refreshToken);
}
