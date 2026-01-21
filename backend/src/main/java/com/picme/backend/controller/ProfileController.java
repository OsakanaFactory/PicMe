package com.picme.backend.controller;

import com.picme.backend.dto.request.ProfileUpdateRequest;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.ProfileResponse;
import com.picme.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
}
