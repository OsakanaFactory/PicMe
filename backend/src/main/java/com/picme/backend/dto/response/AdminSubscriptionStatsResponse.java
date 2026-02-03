package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * サブスクリプション統計レスポンス
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminSubscriptionStatsResponse {

    private Map<String, PlanStatsDto> planStats;
    private long mrr; // 月次経常収益
    private double churnRate; // 解約率
    private List<RecentSubscriptionDto> recentSubscriptions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlanStatsDto {
        private long count;
        private double percentage;
        private long monthlyRevenue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentSubscriptionDto {
        private String username;
        private String planType;
        private String status;
        private String startDate;
    }
}
