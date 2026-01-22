package com.picme.backend.repository;

import com.picme.backend.model.Category;
import com.picme.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * カテゴリーリポジトリ
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * ユーザーのカテゴリーを表示順で取得
     */
    List<Category> findByUserOrderByDisplayOrderAsc(User user);

    /**
     * ユーザーのカテゴリー数をカウント
     */
    long countByUser(User user);

    /**
     * 特定のカテゴリーをIDとユーザーで取得
     */
    Optional<Category> findByIdAndUser(Long id, User user);

    /**
     * ユーザーのカテゴリーをスラッグで取得
     */
    Optional<Category> findByUserAndSlug(User user, String slug);

    /**
     * カテゴリーの表示順を更新
     */
    @Modifying
    @Query("UPDATE Category c SET c.displayOrder = :order WHERE c.id = :id AND c.user = :user")
    void updateDisplayOrder(@Param("id") Long id, @Param("user") User user, @Param("order") Integer order);

    /**
     * ユーザー名でカテゴリーを取得（公開ページ用）
     */
    @Query("SELECT c FROM Category c JOIN c.user u WHERE u.username = :username ORDER BY c.displayOrder ASC")
    List<Category> findByUsername(@Param("username") String username);
}
