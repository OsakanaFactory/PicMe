package com.picme.backend.service;

import com.picme.backend.dto.request.LoginRequest;
import com.picme.backend.dto.request.RefreshTokenRequest;
import com.picme.backend.dto.request.SignupRequest;
import com.picme.backend.dto.response.AuthResponse;

/**
 * 認証サービスインターフェース
 */
public interface AuthService {

    /**
     * ユーザー登録
     */
    AuthResponse signup(SignupRequest request);

    /**
     * ログイン
     */
    AuthResponse login(LoginRequest request);

    /**
     * トークンリフレッシュ
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * ログアウト（将来的にトークンブラックリスト対応予定）
     */
    void logout(String token);

    /**
     * メール認証
     */
    void verifyEmail(String token);

    /**
     * パスワードリセットリクエスト
     */
    void forgotPassword(String email);

    /**
     * パスワードリセット実行
     */
    void resetPassword(String token, String newPassword);

    /**
     * 認証メール再送
     */
    void resendVerification(String email);
}
