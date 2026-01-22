package com.picme.backend.repository;

import com.picme.backend.model.Post;
import com.picme.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * お知らせ投稿リポジトリ
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * ユーザーの投稿を作成日時の降順で取得
     */
    List<Post> findByUserOrderByCreatedAtDesc(User user);

    /**
     * ユーザーの公開投稿を公開日時の降順で取得
     */
    List<Post> findByUserAndVisibleTrueOrderByPublishedAtDesc(User user);

    /**
     * ユーザーの投稿数をカウント
     */
    long countByUser(User user);

    /**
     * 特定の投稿をIDとユーザーで取得
     */
    Optional<Post> findByIdAndUser(Long id, User user);

    /**
     * ユーザー名で公開投稿を取得（公開ページ用）
     */
    @Query("SELECT p FROM Post p JOIN p.user u WHERE u.username = :username AND p.visible = true ORDER BY p.publishedAt DESC")
    List<Post> findPublishedPostsByUsername(@Param("username") String username);

    /**
     * 特定の投稿を公開状態で取得（公開ページ用）
     */
    @Query("SELECT p FROM Post p JOIN p.user u WHERE p.id = :id AND u.username = :username AND p.visible = true")
    Optional<Post> findPublishedPostByIdAndUsername(@Param("id") Long id, @Param("username") String username);
}
