package com.picme.backend.repository;

import com.picme.backend.model.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 作品リポジトリ
 */
@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

    /**
     * ユーザーIDで作品を取得（表示順でソート）
     */
    List<Artwork> findByUserIdOrderByDisplayOrderAsc(Long userId);

    /**
     * ユーザーIDで表示可能な作品を取得
     */
    List<Artwork> findByUserIdAndVisibleTrueOrderByDisplayOrderAsc(Long userId);

    /**
     * 作品IDとユーザーIDで作品を取得
     */
    Optional<Artwork> findByIdAndUserId(Long id, Long userId);

    /**
     * ユーザーIDで作品数をカウント
     */
    long countByUserId(Long userId);

    /**
     * ユーザー名で表示可能な作品を取得
     */
    @Query("SELECT a FROM Artwork a WHERE a.user.username = :username AND a.visible = true ORDER BY a.displayOrder ASC")
    List<Artwork> findPublicArtworksByUsername(@Param("username") String username);

    /**
     * 表示順を更新
     */
    @Modifying
    @Query("UPDATE Artwork a SET a.displayOrder = :order WHERE a.id = :id AND a.user.id = :userId")
    int updateDisplayOrder(@Param("id") Long id, @Param("userId") Long userId, @Param("order") int order);
}
