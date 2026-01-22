package com.picme.backend.service.impl;

import com.picme.backend.dto.request.PostRequest;
import com.picme.backend.dto.response.PostResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.Post;
import com.picme.backend.model.User;
import com.picme.backend.repository.PostRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * お知らせ投稿サービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> getPosts(String email) {
        User user = getUserByEmail(email);

        return postRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getPost(String email, Long postId) {
        User user = getUserByEmail(email);

        Post post = postRepository.findByIdAndUser(postId, user)
                .orElseThrow(() -> ApiException.notFound("投稿"));

        return mapToResponse(post);
    }

    @Override
    @Transactional
    public PostResponse createPost(String email, PostRequest request) {
        User user = getUserByEmail(email);

        // プラン制限チェック
        checkPostLimit(user);

        // Markdown使用チェック（Pro以上のみ）
        if (containsMarkdown(request.getContent()) && !canUseMarkdown(user.getPlanType())) {
            throw ApiException.forbidden("マークダウン記法はProプラン以上でご利用いただけます");
        }

        Post post = Post.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .thumbnailUrl(request.getThumbnailUrl())
                .visible(request.getVisible() != null ? request.getVisible() : true)
                .publishedAt(request.getVisible() != null && request.getVisible() ? LocalDateTime.now() : null)
                .build();

        post = postRepository.save(post);

        log.info("Post created: {} for user: {}", post.getId(), email);

        return mapToResponse(post);
    }

    @Override
    @Transactional
    public PostResponse updatePost(String email, Long postId, PostRequest request) {
        User user = getUserByEmail(email);

        Post post = postRepository.findByIdAndUser(postId, user)
                .orElseThrow(() -> ApiException.notFound("投稿"));

        // Markdown使用チェック（Pro以上のみ）
        if (request.getContent() != null && containsMarkdown(request.getContent()) && !canUseMarkdown(user.getPlanType())) {
            throw ApiException.forbidden("マークダウン記法はProプラン以上でご利用いただけます");
        }

        // 更新可能なフィールドを更新
        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getThumbnailUrl() != null) {
            post.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getVisible() != null) {
            // 非公開から公開に変更する場合、公開日時を設定
            if (request.getVisible() && !post.getVisible()) {
                post.setPublishedAt(LocalDateTime.now());
            }
            post.setVisible(request.getVisible());
        }

        post = postRepository.save(post);

        log.info("Post updated: {} for user: {}", post.getId(), email);

        return mapToResponse(post);
    }

    @Override
    @Transactional
    public void deletePost(String email, Long postId) {
        User user = getUserByEmail(email);

        Post post = postRepository.findByIdAndUser(postId, user)
                .orElseThrow(() -> ApiException.notFound("投稿"));

        postRepository.delete(post);

        log.info("Post deleted: {} for user: {}", postId, email);
    }

    @Override
    @Transactional
    public PostResponse toggleVisibility(String email, Long postId) {
        User user = getUserByEmail(email);

        Post post = postRepository.findByIdAndUser(postId, user)
                .orElseThrow(() -> ApiException.notFound("投稿"));

        boolean newVisibility = !post.getVisible();
        post.setVisible(newVisibility);

        // 公開に変更する場合、公開日時を設定
        if (newVisibility && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        post = postRepository.save(post);

        log.info("Post visibility toggled: {} to {} for user: {}", postId, newVisibility, email);

        return mapToResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> getPublicPosts(String username) {
        return postRepository.findPublishedPostsByUsername(username)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PostResponse getPublicPost(String username, Long postId) {
        Post post = postRepository.findPublishedPostByIdAndUsername(postId, username)
                .orElseThrow(() -> ApiException.notFound("投稿"));

        // 閲覧数をインクリメント
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);

        return mapToResponse(post);
    }

    /**
     * メールアドレスでユーザーを取得
     */
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);
    }

    /**
     * 投稿数の制限をチェック
     */
    private void checkPostLimit(User user) {
        long currentCount = postRepository.countByUser(user);
        int limit = getPostLimit(user.getPlanType());

        if (currentCount >= limit) {
            throw ApiException.limitExceeded(
                    String.format("投稿数の上限（%d件）に達しています。プランをアップグレードしてください。", limit));
        }
    }

    /**
     * プランごとの投稿数上限を取得
     */
    private int getPostLimit(PlanType planType) {
        return switch (planType) {
            case FREE -> 5;
            case STARTER -> 20;
            case PRO, STUDIO -> Integer.MAX_VALUE; // 無制限
        };
    }

    /**
     * Markdown記法が使用可能かチェック
     */
    private boolean canUseMarkdown(PlanType planType) {
        return planType == PlanType.PRO || planType == PlanType.STUDIO;
    }

    /**
     * コンテンツにMarkdown記法が含まれているかチェック
     * 簡易的なチェック：# ## ### ``` ** __ ![]() [](）
     */
    private boolean containsMarkdown(String content) {
        if (content == null) return false;
        return content.contains("```") ||
               content.matches("(?m)^#{1,6}\\s.*") ||
               content.contains("**") ||
               content.contains("__") ||
               content.matches(".*!\\[.*\\]\\(.*\\).*") ||
               content.matches(".*\\[.*\\]\\(.*\\).*");
    }

    /**
     * PostエンティティをPostResponseにマッピング
     */
    private PostResponse mapToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .contentHtml(null) // TODO: Markdown変換が必要な場合はここで行う
                .thumbnailUrl(post.getThumbnailUrl())
                .visible(post.getVisible())
                .viewCount(post.getViewCount())
                .publishedAt(post.getPublishedAt())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
