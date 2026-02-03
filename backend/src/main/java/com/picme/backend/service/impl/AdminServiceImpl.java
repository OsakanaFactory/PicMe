package com.picme.backend.service.impl;

import com.picme.backend.dto.request.InquiryStatusUpdateRequest;
import com.picme.backend.dto.response.*;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.*;
import com.picme.backend.repository.*;
import com.picme.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 管理者サービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ArtworkRepository artworkRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final PostRepository postRepository;
    private final InquiryRepository inquiryRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // プラン別月額料金
    private static final Map<PlanType, Long> PLAN_PRICES = Map.of(
            PlanType.FREE, 0L,
            PlanType.STARTER, 480L,
            PlanType.PRO, 680L,
            PlanType.STUDIO, 1980L
    );

    // プラン別制限
    private static final Map<PlanType, Integer> ARTWORK_LIMITS = Map.of(
            PlanType.FREE, 5,
            PlanType.STARTER, 20,
            PlanType.PRO, 50,
            PlanType.STUDIO, 200
    );

    private static final Map<PlanType, Integer> SOCIAL_LINK_LIMITS = Map.of(
            PlanType.FREE, 2,
            PlanType.STARTER, 5,
            PlanType.PRO, 10,
            PlanType.STUDIO, Integer.MAX_VALUE
    );

    private static final Map<PlanType, Integer> POST_LIMITS = Map.of(
            PlanType.FREE, 1,
            PlanType.STARTER, 5,
            PlanType.PRO, 20,
            PlanType.STUDIO, Integer.MAX_VALUE
    );

    @Override
    public AdminDashboardResponse getDashboard() {
        long totalUsers = userRepository.count();

        // プラン別ユーザー数
        Map<String, Long> usersByPlan = new HashMap<>();
        Map<String, Double> usersByPlanPercentage = new HashMap<>();
        long paidUsers = 0;
        long monthlyRevenue = 0;

        for (PlanType planType : PlanType.values()) {
            long count = userRepository.countByPlanType(planType);
            usersByPlan.put(planType.name(), count);
            usersByPlanPercentage.put(planType.name(), totalUsers > 0 ? (count * 100.0 / totalUsers) : 0);

            if (planType != PlanType.FREE) {
                paidUsers += count;
                monthlyRevenue += count * PLAN_PRICES.get(planType);
            }
        }

        // 最近のユーザー
        List<AdminDashboardResponse.RecentUserDto> recentUsers = userRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(user -> AdminDashboardResponse.RecentUserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .planType(user.getPlanType().name())
                        .createdAt(user.getCreatedAt().format(DATE_FORMATTER))
                        .build())
                .collect(Collectors.toList());

        // 未対応の問い合わせ数
        long pendingInquiries = inquiryRepository.countByStatus(InquiryStatus.PENDING);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .paidUsers(paidUsers)
                .monthlyRevenue(monthlyRevenue)
                .adRevenue(0) // AdSense収益は外部から取得する必要がある
                .usersByPlan(usersByPlan)
                .usersByPlanPercentage(usersByPlanPercentage)
                .recentUsers(recentUsers)
                .pendingInquiries(pendingInquiries)
                .build();
    }

    @Override
    public Page<AdminUserResponse> getUsers(String search, String planType, Pageable pageable) {
        PlanType type = null;
        if (planType != null && !planType.isEmpty()) {
            try {
                type = PlanType.valueOf(planType.toUpperCase());
            } catch (IllegalArgumentException e) {
                // 無効なプランタイプは無視
            }
        }

        Page<User> users = userRepository.searchUsers(
                search != null && !search.isEmpty() ? search : null,
                type,
                pageable
        );

        return users.map(this::toAdminUserResponse);
    }

    @Override
    public AdminUserResponse getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("ユーザーが見つかりません"));
        return toAdminUserResponse(user);
    }

    @Override
    @Transactional
    public void suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("ユーザーが見つかりません"));
        user.setIsActive(false);
        userRepository.save(user);
        log.info("ユーザーアカウント停止: userId={}", userId);
    }

    @Override
    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("ユーザーが見つかりません"));
        user.setIsActive(true);
        userRepository.save(user);
        log.info("ユーザーアカウント有効化: userId={}", userId);
    }

    @Override
    public AdminSubscriptionStatsResponse getSubscriptionStats() {
        long totalUsers = userRepository.count();

        Map<String, AdminSubscriptionStatsResponse.PlanStatsDto> planStats = new HashMap<>();
        long mrr = 0;

        for (PlanType planType : PlanType.values()) {
            long count = userRepository.countByPlanType(planType);
            long revenue = count * PLAN_PRICES.get(planType);
            mrr += revenue;

            planStats.put(planType.name(), AdminSubscriptionStatsResponse.PlanStatsDto.builder()
                    .count(count)
                    .percentage(totalUsers > 0 ? (count * 100.0 / totalUsers) : 0)
                    .monthlyRevenue(revenue)
                    .build());
        }

        // 最近のサブスクリプション（アクティブなサブスクリプションを持つユーザー）
        List<AdminSubscriptionStatsResponse.RecentSubscriptionDto> recentSubscriptions =
                subscriptionRepository.findAll().stream()
                        .limit(10)
                        .map(sub -> {
                            User user = sub.getUser();
                            return AdminSubscriptionStatsResponse.RecentSubscriptionDto.builder()
                                    .username(user != null ? user.getUsername() : "Unknown")
                                    .planType(sub.getPlanType().name())
                                    .status(sub.getStatus().name())
                                    .startDate(sub.getCurrentPeriodStart() != null ?
                                            sub.getCurrentPeriodStart().format(DATE_FORMATTER) : "")
                                    .build();
                        })
                        .collect(Collectors.toList());

        return AdminSubscriptionStatsResponse.builder()
                .planStats(planStats)
                .mrr(mrr)
                .churnRate(2.5) // 仮の値（実際は期間中のキャンセル数から計算）
                .recentSubscriptions(recentSubscriptions)
                .build();
    }

    @Override
    public Page<InquiryResponse> getInquiries(String status, Pageable pageable) {
        Page<Inquiry> inquiries;

        if (status != null && !status.isEmpty()) {
            try {
                InquiryStatus inquiryStatus = InquiryStatus.valueOf(status.toUpperCase());
                inquiries = inquiryRepository.findByStatus(inquiryStatus, pageable);
            } catch (IllegalArgumentException e) {
                inquiries = inquiryRepository.findAllByOrderByCreatedAtDesc(pageable);
            }
        } else {
            inquiries = inquiryRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return inquiries.map(this::toInquiryResponse);
    }

    @Override
    public InquiryResponse getInquiry(Long inquiryId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> ApiException.notFound("問い合わせが見つかりません"));
        return toInquiryResponse(inquiry);
    }

    @Override
    @Transactional
    public InquiryResponse updateInquiryStatus(Long inquiryId, InquiryStatusUpdateRequest request) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> ApiException.notFound("問い合わせが見つかりません"));

        inquiry.setStatus(request.getStatus());
        if (request.getAdminNote() != null) {
            inquiry.setAdminNote(request.getAdminNote());
        }

        inquiry = inquiryRepository.save(inquiry);
        log.info("問い合わせステータス更新: inquiryId={}, status={}", inquiryId, request.getStatus());

        return toInquiryResponse(inquiry);
    }

    @Override
    public SystemMetricsResponse getSystemMetrics() {
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();

        // CPU使用率（システム負荷平均）
        double cpuLoad = osBean.getSystemLoadAverage();
        if (cpuLoad < 0) cpuLoad = 0; // Windowsでは-1が返される場合がある

        // メモリ使用率
        long usedMemory = memoryBean.getHeapMemoryUsage().getUsed();
        long maxMemory = memoryBean.getHeapMemoryUsage().getMax();
        double memoryPercent = maxMemory > 0 ? (usedMemory * 100.0 / maxMemory) : 0;

        // ディスク使用率（簡易的な実装）
        java.io.File root = new java.io.File("/");
        double diskPercent = root.getTotalSpace() > 0 ?
                ((root.getTotalSpace() - root.getFreeSpace()) * 100.0 / root.getTotalSpace()) : 0;

        return SystemMetricsResponse.builder()
                .cpu(SystemMetricsResponse.ResourceUsage.builder()
                        .usagePercent(Math.min(cpuLoad * 10, 100)) // 簡易的な変換
                        .status(getResourceStatus(cpuLoad * 10))
                        .build())
                .memory(SystemMetricsResponse.ResourceUsage.builder()
                        .usagePercent(memoryPercent)
                        .status(getResourceStatus(memoryPercent))
                        .build())
                .disk(SystemMetricsResponse.ResourceUsage.builder()
                        .usagePercent(diskPercent)
                        .status(getResourceStatus(diskPercent))
                        .build())
                .database(SystemMetricsResponse.DatabaseMetrics.builder()
                        .activeConnections(10) // 実際はDataSourceから取得
                        .maxConnections(100)
                        .avgResponseTimeMs(25.0)
                        .build())
                .errors(SystemMetricsResponse.ErrorMetrics.builder()
                        .error5xx(0) // 実際はログから集計
                        .error4xx(0)
                        .period("24h")
                        .build())
                .build();
    }

    private String getResourceStatus(double percent) {
        if (percent >= 90) return "critical";
        if (percent >= 70) return "warning";
        return "normal";
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        long artworkCount = artworkRepository.countByUserId(user.getId());
        long socialLinkCount = socialLinkRepository.countByUserId(user.getId());
        long postCount = postRepository.countByUser(user);

        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .planType(user.getPlanType())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .usage(AdminUserResponse.UsageDto.builder()
                        .artworkCount(artworkCount)
                        .artworkLimit(ARTWORK_LIMITS.get(user.getPlanType()))
                        .socialLinkCount(socialLinkCount)
                        .socialLinkLimit(SOCIAL_LINK_LIMITS.get(user.getPlanType()))
                        .postCount(postCount)
                        .postLimit(POST_LIMITS.get(user.getPlanType()))
                        .build())
                .build();
    }

    private InquiryResponse toInquiryResponse(Inquiry inquiry) {
        return InquiryResponse.builder()
                .id(inquiry.getId())
                .userId(inquiry.getUser() != null ? inquiry.getUser().getId() : null)
                .username(inquiry.getUser() != null ? inquiry.getUser().getUsername() : null)
                .name(inquiry.getName())
                .email(inquiry.getEmail())
                .subject(inquiry.getSubject())
                .message(inquiry.getMessage())
                .status(inquiry.getStatus())
                .adminNote(inquiry.getAdminNote())
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .build();
    }
}
