package com.picme.backend.repository;

import com.picme.backend.model.Tag;
import com.picme.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * タグリポジトリ
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * ユーザーのタグを名前順で取得
     */
    List<Tag> findByUserOrderByNameAsc(User user);

    /**
     * ユーザーのタグ数をカウント
     */
    long countByUser(User user);

    /**
     * 特定のタグをIDとユーザーで取得
     */
    Optional<Tag> findByIdAndUser(Long id, User user);

    /**
     * ユーザーのタグを名前で取得
     */
    Optional<Tag> findByUserAndName(User user, String name);

    /**
     * ユーザーのタグを名前のリストで取得
     */
    List<Tag> findByUserAndNameIn(User user, Set<String> names);

    /**
     * ユーザー名でタグを取得（公開ページ用）
     */
    @Query("SELECT t FROM Tag t JOIN t.user u WHERE u.username = :username ORDER BY t.name ASC")
    List<Tag> findByUsername(@Param("username") String username);
}
