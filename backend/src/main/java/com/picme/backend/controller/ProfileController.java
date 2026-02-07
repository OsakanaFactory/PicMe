package com.picme.backend.controller;

import com.picme.backend.dto.request.CustomCssRequest;
import com.picme.backend.dto.request.ProfileUpdateRequest;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.ProfileResponse;
import com.picme.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * プロフィールコントローラー
 */
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    /**
     * 現在のユーザーのプロフィールを取得
     * GET /api/profile
     */
    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Get profile request for: {}", userDetails.getUsername());

        ProfileResponse profile = profileService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * プロフィールを更新
     * PUT /api/profile
     */
    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileUpdateRequest request) {

        log.info("Update profile request for: {}", userDetails.getUsername());

        ProfileResponse profile = profileService.updateProfile(
                userDetails.getUsername(), request);

        return ResponseEntity.ok(ApiResponse.success("プロフィールを更新しました", profile));
    }

    /**
     * アバター画像をアップロード
     * POST /api/profile/avatar
     */
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        log.info("Upload avatar request for: {}", userDetails.getUsername());

        ProfileResponse profile = profileService.uploadAvatar(userDetails.getUsername(), file);
        return ResponseEntity.ok(ApiResponse.success("アバターを更新しました", profile));
    }

    /**
     * ヘッダー画像をアップロード
     * POST /api/profile/header
     */
    @PostMapping(value = "/header", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadHeader(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        log.info("Upload header request for: {}", userDetails.getUsername());

        ProfileResponse profile = profileService.uploadHeader(userDetails.getUsername(), file);
        return ResponseEntity.ok(ApiResponse.success("ヘッダーを更新しました", profile));
    }

    /**
     * カスタムCSSを更新（PRO/STUDIO のみ）
     * PUT /api/profile/custom-css
     */
    @PutMapping("/custom-css")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateCustomCss(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CustomCssRequest request) {

        log.info("Update custom CSS request for: {}", userDetails.getUsername());

        ProfileResponse profile = profileService.updateCustomCss(
                userDetails.getUsername(), request.getCustomCss());

        return ResponseEntity.ok(ApiResponse.success("カスタムCSSを更新しました", profile));
    }
}
