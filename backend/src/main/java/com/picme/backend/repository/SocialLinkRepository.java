package com.picme.backend.repository;

import com.picme.backend.model.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * SNSリンクリポジトリ
 */
@Repository
public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {

    /**
     * ユーザーIDでリンクを取得（表示順でソート）
     */
    List<SocialLink> findByUserIdOrderByDisplayOrderAsc(Long userId);

    /**
     * ユーザーIDで表示可能なリンクを取得
     */
    List<SocialLink> findByUserIdAndVisibleTrueOrderByDisplayOrderAsc(Long userId);

    /**
     * リンクIDとユーザーIDでリンクを取得
     */
    Optional<SocialLink> findByIdAndUserId(Long id, Long userId);

    /**
     * ユーザーIDでリンク数をカウント
     */
    long countByUserId(Long userId);

    /**
     * ユーザー名で表示可能なリンクを取得
     */
    @Query("SELECT s FROM SocialLink s WHERE s.user.username = :username AND s.visible = true ORDER BY s.displayOrder ASC")
    List<SocialLink> findPublicLinksByUsername(@Param("username") String username);

    /**
     * 表示順を更新
     */
    @Modifying
    @Query("UPDATE SocialLink s SET s.displayOrder = :order WHERE s.id = :id AND s.user.id = :userId")
    int updateDisplayOrder(@Param("id") Long id, @Param("userId") Long userId, @Param("order") int order);
}
