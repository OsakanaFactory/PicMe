package com.picme.backend.dto.response;

import com.picme.backend.model.PlanType;
import com.picme.backend.model.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * サブスクリプション情報レスポンス
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {

    private boolean success;
    private String message;
    private SubscriptionDto data;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscriptionDto {
        private PlanType planType;
        private SubscriptionStatus status;
        private LocalDateTime currentPeriodStart;
        private LocalDateTime currentPeriodEnd;
        private boolean cancelAtPeriodEnd;
        private PlanLimits limits;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlanLimits {
        private int maxArtworks;
        private int maxSocialLinks;
        private int maxPosts;
        private int maxCategories;
        private int maxStorageMb;
        private boolean hasAds;
    }
}
