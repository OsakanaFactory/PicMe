package com.picme.backend.repository;

import com.picme.backend.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * プロフィールリポジトリ
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    /**
     * ユーザーIDでプロフィールを検索
     */
    Optional<Profile> findByUserId(Long userId);

    /**
     * ユーザー名でプロフィールを検索（公開ページ用）
     */
    Optional<Profile> findByUserUsername(String username);
}
