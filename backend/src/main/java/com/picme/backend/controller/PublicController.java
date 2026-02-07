package com.picme.backend.controller;

import com.picme.backend.dto.request.PublicInquiryRequest;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.ArtworkResponse;
import com.picme.backend.dto.response.CategoryResponse;
import com.picme.backend.dto.response.PostResponse;
import com.picme.backend.dto.response.ProfileResponse;
import com.picme.backend.dto.response.PublicPageResponse;
import com.picme.backend.dto.response.SocialLinkResponse;
import com.picme.backend.dto.response.TagResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.Inquiry;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.User;
import com.picme.backend.repository.InquiryRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 公開ページコントローラー
 * 認証不要で公開プロフィール情報を取得
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class PublicController {

    private final ProfileService profileService;
    private final ArtworkService artworkService;
    private final SocialLinkService socialLinkService;
    private final PostService postService;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final UserRepository userRepository;
    private final InquiryRepository inquiryRepository;
    private final EmailService emailService;

    /**
     * ユーザーの公開ページデータを取得
     * GET /api/users/:username
     */
    private final AnalyticsService analyticsService;

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<PublicPageResponse>> getPublicPage(
            @PathVariable String username,
            @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedFor,
            @RequestHeader(value = "Referer", required = false) String referer,
            @RequestHeader(value = "User-Agent", required = false) String userAgent) {

        log.info("Get public page request for: {}", username);

        // ページビュー記録（非同期）
        userRepository.findByUsername(username).ifPresent(user ->
            analyticsService.recordPageView(user, forwardedFor, referer, userAgent)
        );

        // 各サービスから公開データを取得
        ProfileResponse profile = profileService.getPublicProfile(username);
        List<ArtworkResponse> artworks = artworkService.getPublicArtworks(username);
        List<SocialLinkResponse> socialLinks = socialLinkService.getPublicSocialLinks(username);
        List<PostResponse> posts = postService.getPublicPosts(username);
        List<CategoryResponse> categories = categoryService.getPublicCategories(username);
        List<TagResponse> tags = tagService.getPublicTags(username);

        PublicPageResponse response = PublicPageResponse.builder()
                .profile(profile)
                .artworks(artworks)
                .socialLinks(socialLinks)
                .posts(posts)
                .categories(categories)
                .tags(tags)
                .contactFormEnabled(profile.getContactFormEnabled())
                .customCss(profile.getCustomCss())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * ユーザーの公開プロフィールのみを取得
     * GET /api/users/:username/profile
     */
    @GetMapping("/{username}/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getPublicProfile(
            @PathVariable String username) {

        log.info("Get public profile request for: {}", username);

        ProfileResponse profile = profileService.getPublicProfile(username);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    /**
     * ユーザーの公開作品一覧を取得
     * GET /api/users/:username/artworks
     */
    @GetMapping("/{username}/artworks")
    public ResponseEntity<ApiResponse<List<ArtworkResponse>>> getPublicArtworks(
            @PathVariable String username) {

        log.info("Get public artworks request for: {}", username);

        List<ArtworkResponse> artworks = artworkService.getPublicArtworks(username);
        return ResponseEntity.ok(ApiResponse.success(artworks));
    }

    /**
     * ユーザーの公開SNSリンク一覧を取得
     * GET /api/users/:username/social-links
     */
    @GetMapping("/{username}/social-links")
    public ResponseEntity<ApiResponse<List<SocialLinkResponse>>> getPublicSocialLinks(
            @PathVariable String username) {

        log.info("Get public social links request for: {}", username);

        List<SocialLinkResponse> socialLinks = socialLinkService.getPublicSocialLinks(username);
        return ResponseEntity.ok(ApiResponse.success(socialLinks));
    }

    /**
     * ユーザーの公開お知らせ一覧を取得
     * GET /api/users/:username/posts
     */
    @GetMapping("/{username}/posts")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getPublicPosts(
            @PathVariable String username) {

        log.info("Get public posts request for: {}", username);

        List<PostResponse> posts = postService.getPublicPosts(username);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    /**
     * ユーザーの公開お知らせ詳細を取得
     * GET /api/users/:username/posts/:id
     */
    @GetMapping("/{username}/posts/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPublicPost(
            @PathVariable String username,
            @PathVariable Long id) {

        log.info("Get public post request: {} for: {}", id, username);

        PostResponse post = postService.getPublicPost(username, id);
        return ResponseEntity.ok(ApiResponse.success(post));
    }

    /**
     * ユーザーの公開カテゴリー一覧を取得
     * GET /api/users/:username/categories
     */
    @GetMapping("/{username}/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getPublicCategories(
            @PathVariable String username) {

        log.info("Get public categories request for: {}", username);

        List<CategoryResponse> categories = categoryService.getPublicCategories(username);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * ユーザーの公開タグ一覧を取得
     * GET /api/users/:username/tags
     */
    @GetMapping("/{username}/tags")
    public ResponseEntity<ApiResponse<List<TagResponse>>> getPublicTags(
            @PathVariable String username) {

        log.info("Get public tags request for: {}", username);

        List<TagResponse> tags = tagService.getPublicTags(username);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }

    /**
     * 問い合わせを送信（PRO/STUDIO のみ受付）
     * POST /api/users/:username/inquiries
     */
    @PostMapping("/{username}/inquiries")
    public ResponseEntity<ApiResponse<Void>> submitInquiry(
            @PathVariable String username,
            @Valid @RequestBody PublicInquiryRequest request) {

        log.info("Inquiry submission for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(ApiException::userNotFound);

        // PRO/STUDIO のみ問い合わせフォーム有効
        if (user.getPlanType() != PlanType.PRO && user.getPlanType() != PlanType.STUDIO) {
            throw ApiException.badRequest("このユーザーは問い合わせフォームを利用できません");
        }

        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();

        inquiryRepository.save(inquiry);

        // メール通知
        emailService.sendInquiryNotification(
                user.getEmail(),
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );

        return new ResponseEntity<>(ApiResponse.success("問い合わせを送信しました"), HttpStatus.CREATED);
    }
}
