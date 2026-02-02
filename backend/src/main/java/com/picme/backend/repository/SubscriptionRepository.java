package com.picme.backend.repository;

import com.picme.backend.model.Subscription;
import com.picme.backend.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * サブスクリプションリポジトリ
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserId(Long userId);

    Optional<Subscription> findByStripeCustomerId(String stripeCustomerId);

    Optional<Subscription> findByStripeSubscriptionId(String stripeSubscriptionId);

    boolean existsByUserId(Long userId);

    long countByStatus(SubscriptionStatus status);
}
