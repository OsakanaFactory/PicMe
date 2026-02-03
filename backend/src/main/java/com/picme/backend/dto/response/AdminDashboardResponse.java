package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * 管理者ダッシュボードレスポンス
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long paidUsers;
    private long monthlyRevenue;
    private long adRevenue;

    private Map<String, Long> usersByPlan;
    private Map<String, Double> usersByPlanPercentage;

    private List<RecentUserDto> recentUsers;
    private long pendingInquiries;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentUserDto {
        private Long id;
        private String username;
        private String planType;
        private String createdAt;
    }
}
