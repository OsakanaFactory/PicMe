package com.picme.backend.service;

import com.picme.backend.dto.request.AdminCreateUserRequest;
import com.picme.backend.dto.request.InquiryStatusUpdateRequest;
import com.picme.backend.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 管理者サービスインターフェース
 */
public interface AdminService {

    // ダッシュボード
    AdminDashboardResponse getDashboard();

    // ユーザー管理
    AdminUserResponse createUser(AdminCreateUserRequest request);
    Page<AdminUserResponse> getUsers(String search, String planType, Pageable pageable);
    AdminUserResponse getUser(Long userId);
    void suspendUser(Long userId);
    void activateUser(Long userId);

    // サブスクリプション管理
    AdminSubscriptionStatsResponse getSubscriptionStats();

    // 問い合わせ管理
    Page<InquiryResponse> getInquiries(String status, Pageable pageable);
    InquiryResponse getInquiry(Long inquiryId);
    InquiryResponse updateInquiryStatus(Long inquiryId, InquiryStatusUpdateRequest request);

    // システムメトリクス
    SystemMetricsResponse getSystemMetrics();
}
