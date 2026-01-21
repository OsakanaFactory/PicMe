package com.picme.backend.controller;

import com.picme.backend.dto.request.SocialLinkReorderRequest;
import com.picme.backend.dto.request.SocialLinkRequest;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.SocialLinkResponse;
import com.picme.backend.service.SocialLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SNSリンクコントローラー
 */
@RestController
@RequestMapping("/api/social-links")
@RequiredArgsConstructor
@Slf4j
public class SocialLinkController {

    private final SocialLinkService socialLinkService;

    /**
     * SNSリンク一覧を取得
     * GET /api/social-links
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SocialLinkResponse>>> getSocialLinks(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Get social links request for: {}", userDetails.getUsername());

        List<SocialLinkResponse> links = socialLinkService.getSocialLinks(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(links));
    }

    /**
     * SNSリンクを作成
     * POST /api/social-links
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SocialLinkResponse>> createSocialLink(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SocialLinkRequest request) {

        log.info("Create social link request for: {}", userDetails.getUsername());

        SocialLinkResponse link = socialLinkService.createSocialLink(
                userDetails.getUsername(), request);

        return new ResponseEntity<>(
                ApiResponse.success("SNSリンクを追加しました", link),
                HttpStatus.CREATED);
    }

    /**
     * SNSリンクを更新
     * PUT /api/social-links/:id
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SocialLinkResponse>> updateSocialLink(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody SocialLinkRequest request) {

        log.info("Update social link request: {} for: {}", id, userDetails.getUsername());

        SocialLinkResponse link = socialLinkService.updateSocialLink(
                userDetails.getUsername(), id, request);

        return ResponseEntity.ok(ApiResponse.success("SNSリンクを更新しました", link));
    }

    /**
     * SNSリンクを削除
     * DELETE /api/social-links/:id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSocialLink(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Delete social link request: {} for: {}", id, userDetails.getUsername());

        socialLinkService.deleteSocialLink(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("SNSリンクを削除しました"));
    }

    /**
     * SNSリンクの並び順を更新
     * PUT /api/social-links/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderSocialLinks(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SocialLinkReorderRequest request) {

        log.info("Reorder social links request for: {}", userDetails.getUsername());

        socialLinkService.reorderSocialLinks(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("並び順を更新しました"));
    }
}
