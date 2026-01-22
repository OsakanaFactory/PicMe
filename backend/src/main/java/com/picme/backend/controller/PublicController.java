package com.picme.backend.controller;

import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.ArtworkResponse;
import com.picme.backend.dto.response.PostResponse;
import com.picme.backend.dto.response.ProfileResponse;
import com.picme.backend.dto.response.PublicPageResponse;
import com.picme.backend.dto.response.SocialLinkResponse;
import com.picme.backend.service.ArtworkService;
import com.picme.backend.service.PostService;
import com.picme.backend.service.ProfileService;
import com.picme.backend.service.SocialLinkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    /**
     * ユーザーの公開ページデータを取得
     * GET /api/users/:username
     */
    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<PublicPageResponse>> getPublicPage(
            @PathVariable String username) {

        log.info("Get public page request for: {}", username);

        // 各サービスから公開データを取得
        ProfileResponse profile = profileService.getPublicProfile(username);
        List<ArtworkResponse> artworks = artworkService.getPublicArtworks(username);
        List<SocialLinkResponse> socialLinks = socialLinkService.getPublicSocialLinks(username);
        List<PostResponse> posts = postService.getPublicPosts(username);

        PublicPageResponse response = PublicPageResponse.builder()
                .profile(profile)
                .artworks(artworks)
                .socialLinks(socialLinks)
                .posts(posts)
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
}
