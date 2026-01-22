package com.picme.backend.service;

import com.picme.backend.dto.request.PostRequest;
import com.picme.backend.dto.response.PostResponse;

import java.util.List;

/**
 * お知らせ投稿サービスインターフェース
 */
public interface PostService {

    /**
     * ユーザーの投稿一覧を取得
     */
    List<PostResponse> getPosts(String email);

    /**
     * 投稿を取得
     */
    PostResponse getPost(String email, Long postId);

    /**
     * 投稿を作成
     */
    PostResponse createPost(String email, PostRequest request);

    /**
     * 投稿を更新
     */
    PostResponse updatePost(String email, Long postId, PostRequest request);

    /**
     * 投稿を削除
     */
    void deletePost(String email, Long postId);

    /**
     * 投稿の公開状態を切り替え
     */
    PostResponse toggleVisibility(String email, Long postId);

    /**
     * 公開投稿を取得（公開ページ用）
     */
    List<PostResponse> getPublicPosts(String username);

    /**
     * 公開投稿の詳細を取得（公開ページ用）
     */
    PostResponse getPublicPost(String username, Long postId);
}
