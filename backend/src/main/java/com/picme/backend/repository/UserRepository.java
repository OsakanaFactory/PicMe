package com.picme.backend.repository;

import com.picme.backend.model.PlanType;
import com.picme.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    /**
     * プランタイプ別ユーザー数をカウント
     */
    long countByPlanType(PlanType planType);

    /**
     * ユーザー検索（管理者用）
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR u.username LIKE %:search% OR u.email LIKE %:search%) AND " +
           "(:planType IS NULL OR u.planType = :planType)")
    Page<User> searchUsers(@Param("search") String search,
                          @Param("planType") PlanType planType,
                          Pageable pageable);

    /**
     * 最近登録されたユーザーを取得
     */
    List<User> findTop10ByOrderByCreatedAtDesc();

    /**
     * サイトマップ用: 全アクティブユーザーのusernameとupdatedAtを取得
     */
    @Query("SELECT u.username, u.updatedAt FROM User u WHERE u.isActive = true")
    List<Object[]> findAllActiveUsernamesAndUpdatedAt();
}
