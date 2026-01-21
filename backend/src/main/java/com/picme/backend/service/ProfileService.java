package com.picme.backend.service;

import com.picme.backend.dto.request.ProfileUpdateRequest;
import com.picme.backend.dto.response.ProfileResponse;

/**
 * プロフィールサービスインターフェース
 */
public interface ProfileService {

    /**
     * 現在のユーザーのプロフィールを取得
     */
    ProfileResponse getProfile(String email);

    /**
     * プロフィールを更新
     */
    ProfileResponse updateProfile(String email, ProfileUpdateRequest request);

    /**
     * ユーザー名で公開プロフィールを取得
     */
    ProfileResponse getPublicProfile(String username);
}
