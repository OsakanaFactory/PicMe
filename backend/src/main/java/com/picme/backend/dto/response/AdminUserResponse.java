package com.picme.backend.dto.response;

import com.picme.backend.model.PlanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 管理者用ユーザー情報レスポンス
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private PlanType planType;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 利用状況
    private UsageDto usage;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageDto {
        private long artworkCount;
        private long artworkLimit;
        private long socialLinkCount;
        private long socialLinkLimit;
        private long postCount;
        private long postLimit;
    }
}
