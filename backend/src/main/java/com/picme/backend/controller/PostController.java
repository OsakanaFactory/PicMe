package com.picme.backend.controller;

import com.picme.backend.dto.request.PostRequest;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.PostResponse;
import com.picme.backend.service.PostService;
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
 * お知らせ投稿コントローラー
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;

    /**
     * 投稿一覧を取得
     * GET /api/posts
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponse>>> getPosts(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Get posts request for: {}", userDetails.getUsername());

        List<PostResponse> posts = postService.getPosts(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    /**
     * 投稿を取得
     * GET /api/posts/:id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Get post request: {} for: {}", id, userDetails.getUsername());

        PostResponse post = postService.getPost(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(post));
    }

    /**
     * 投稿を作成
     * POST /api/posts
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PostRequest request) {

        log.info("Create post request for: {}", userDetails.getUsername());

        PostResponse post = postService.createPost(userDetails.getUsername(), request);
        return new ResponseEntity<>(
                ApiResponse.success("お知らせを投稿しました", post),
                HttpStatus.CREATED);
    }

    /**
     * 投稿を更新
     * PUT /api/posts/:id
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request) {

        log.info("Update post request: {} for: {}", id, userDetails.getUsername());

        PostResponse post = postService.updatePost(
                userDetails.getUsername(), id, request);

        return ResponseEntity.ok(ApiResponse.success("お知らせを更新しました", post));
    }

    /**
     * 投稿を削除
     * DELETE /api/posts/:id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Delete post request: {} for: {}", id, userDetails.getUsername());

        postService.deletePost(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("お知らせを削除しました"));
    }

    /**
     * 投稿の公開状態を切り替え
     * PUT /api/posts/:id/toggle-visibility
     */
    @PutMapping("/{id}/toggle-visibility")
    public ResponseEntity<ApiResponse<PostResponse>> toggleVisibility(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Toggle post visibility request: {} for: {}", id, userDetails.getUsername());

        PostResponse post = postService.toggleVisibility(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("公開状態を変更しました", post));
    }
}
