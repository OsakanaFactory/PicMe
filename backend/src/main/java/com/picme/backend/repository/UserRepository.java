package com.picme.backend.repository;

import com.picme.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ユーザーリポジトリ
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * メールアドレスでユーザーを検索
     */
    Optional<User> findByEmail(String email);

    /**
     * ユーザー名でユーザーを検索
     */
    Optional<User> findByUsername(String username);

    /**
     * メールアドレスの存在確認
     */
    boolean existsByEmail(String email);

    /**
     * ユーザー名の存在確認
     */
    boolean existsByUsername(String username);

    /**
     * OAuthプロバイダーとIDでユーザーを検索
     */
    Optional<User> findByOauthProviderAndOauthId(String provider, String oauthId);
}
