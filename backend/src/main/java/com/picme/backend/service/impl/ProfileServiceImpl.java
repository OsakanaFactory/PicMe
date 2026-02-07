package com.picme.backend.service.impl;

import com.picme.backend.dto.request.ProfileUpdateRequest;
import com.picme.backend.dto.response.ProfileResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.Profile;
import com.picme.backend.model.User;
import com.picme.backend.repository.ProfileRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.model.PlanType;
import com.picme.backend.service.CloudinaryService;
import com.picme.backend.service.CloudinaryService.CloudinaryUploadResult;
import com.picme.backend.service.ProfileService;
import com.picme.backend.util.CssSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

/**
 * プロフィールサービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private static final Set<String> VALID_THEMES = Set.of("LIGHT", "DARK", "WARM", "COOL");

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.notFound("プロフィール"));

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.notFound("プロフィール"));

        // 更新可能なフィールドを更新
        if (request.getDisplayName() != null) {
            profile.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            profile.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getHeaderUrl() != null) {
            profile.setHeaderUrl(request.getHeaderUrl());
        }
        if (request.getTheme() != null) {
            if (!VALID_THEMES.contains(request.getTheme())) {
                throw ApiException.badRequest("無効なテーマ名です。有効な値: LIGHT, DARK, WARM, COOL");
            }
            profile.setTheme(request.getTheme());
        }
        if (request.getColorPrimary() != null) {
            profile.setColorPrimary(request.getColorPrimary());
        }
        if (request.getColorAccent() != null) {
            profile.setColorAccent(request.getColorAccent());
        }
        if (request.getFontFamily() != null) {
            profile.setFontFamily(request.getFontFamily());
        }
        if (request.getLayout() != null) {
            profile.setLayout(request.getLayout());
        }
        if (request.getContactFormEnabled() != null) {
            profile.setContactFormEnabled(request.getContactFormEnabled());
        }

        profile = profileRepository.save(profile);

        log.info("Profile updated for user: {}", email);

        return mapToResponse(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getPublicProfile(String username) {
        Profile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> ApiException.notFound("ユーザー"));

        // 非アクティブユーザーは表示しない
        if (!profile.getUser().getIsActive()) {
            throw ApiException.notFound("ユーザー");
        }

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public ProfileResponse uploadAvatar(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.notFound("プロフィール"));

        // 既存のアバターがCloudinaryにある場合は削除
        // avatarUrlからpublicIdを抽出する代わりに、新しい画像で上書き
        CloudinaryUploadResult result = cloudinaryService.uploadImage(file, "avatars", user.getId());

        profile.setAvatarUrl(result.secureUrl());
        profile = profileRepository.save(profile);

        log.info("Avatar uploaded for user: {}", email);

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public ProfileResponse uploadHeader(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.notFound("プロフィール"));

        CloudinaryUploadResult result = cloudinaryService.uploadImage(file, "headers", user.getId());

        profile.setHeaderUrl(result.secureUrl());
        profile = profileRepository.save(profile);

        log.info("Header uploaded for user: {}", email);

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public ProfileResponse updateCustomCss(String email, String customCss) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);

        // PRO/STUDIO のみカスタムCSS利用可
        PlanType plan = user.getPlanType();
        if (plan != PlanType.PRO && plan != PlanType.STUDIO) {
            throw ApiException.forbidden("カスタムCSSはPRO以上のプランで利用できます");
        }

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.notFound("プロフィール"));

        // 行数制限: PRO 100行, STUDIO 500行
        int maxLines = (plan == PlanType.STUDIO) ? 500 : 100;
        String validationError = CssSanitizer.validate(customCss, maxLines);
        if (validationError != null) {
            throw ApiException.badRequest(validationError);
        }

        // サニタイズして保存
        String sanitizedCss = CssSanitizer.sanitize(customCss);
        profile.setCustomCss(sanitizedCss);
        profile = profileRepository.save(profile);

        log.info("Custom CSS updated for user: {}", email);

        return mapToResponse(profile);
    }

    /**
     * ProfileエンティティをProfileResponseにマッピング
     */
    private ProfileResponse mapToResponse(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .username(profile.getUser().getUsername())
                .displayName(profile.getDisplayName())
                .bio(profile.getBio())
                .avatarUrl(profile.getAvatarUrl())
                .headerUrl(profile.getHeaderUrl())
                .theme(profile.getTheme())
                .colorPrimary(profile.getColorPrimary())
                .colorAccent(profile.getColorAccent())
                .fontFamily(profile.getFontFamily())
                .layout(profile.getLayout())
                .customCss(profile.getCustomCss())
                .contactFormEnabled(profile.getContactFormEnabled())
                .planType(profile.getUser().getPlanType() != null ? profile.getUser().getPlanType().name() : "FREE")
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
