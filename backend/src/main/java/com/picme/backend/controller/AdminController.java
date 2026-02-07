package com.picme.backend.controller;

import com.picme.backend.dto.request.AdminCreateUserRequest;
import com.picme.backend.dto.request.InquiryStatusUpdateRequest;
import com.picme.backend.dto.response.*;
import com.picme.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 管理者機能コントローラー
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ========== ダッシュボード ==========

    /**
     * ダッシュボード統計取得
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse response = adminService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // ========== ユーザー管理 ==========

    /**
     * ユーザー作成（管理者用）
     */
    @PostMapping("/users/create")
    public ResponseEntity<ApiResponse<AdminUserResponse>> createUser(
            @Valid @RequestBody AdminCreateUserRequest request) {
        AdminUserResponse user = adminService.createUser(request);
        return new ResponseEntity<>(
                ApiResponse.success("ユーザーを作成しました", user),
                HttpStatus.CREATED);
    }

    /**
     * ユーザー一覧取得
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String planType,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<AdminUserResponse> users = adminService.getUsers(search, planType, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    /**
     * ユーザー詳細取得
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getUser(
            @PathVariable Long userId) {
        AdminUserResponse user = adminService.getUser(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    /**
     * ユーザーアカウント停止
     */
    @PostMapping("/users/{userId}/suspend")
    public ResponseEntity<ApiResponse<Void>> suspendUser(
            @PathVariable Long userId) {
        adminService.suspendUser(userId);
        return ResponseEntity.ok(ApiResponse.success("アカウントを停止しました"));
    }

    /**
     * ユーザーアカウント有効化
     */
    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<ApiResponse<Void>> activateUser(
            @PathVariable Long userId) {
        adminService.activateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("アカウントを有効化しました"));
    }

    // ========== サブスクリプション管理 ==========

    /**
     * サブスクリプション一覧取得
     */
    @GetMapping("/subscriptions")
    public ResponseEntity<ApiResponse<AdminSubscriptionStatsResponse>> getSubscriptions() {
        AdminSubscriptionStatsResponse stats = adminService.getSubscriptionStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * サブスクリプション統計取得
     */
    @GetMapping("/subscriptions/stats")
    public ResponseEntity<ApiResponse<AdminSubscriptionStatsResponse>> getSubscriptionStats() {
        AdminSubscriptionStatsResponse stats = adminService.getSubscriptionStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ========== 問い合わせ管理 ==========

    /**
     * 問い合わせ一覧取得
     */
    @GetMapping("/inquiries")
    public ResponseEntity<ApiResponse<Page<InquiryResponse>>> getInquiries(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<InquiryResponse> inquiries = adminService.getInquiries(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(inquiries));
    }

    /**
     * 問い合わせ詳細取得
     */
    @GetMapping("/inquiries/{inquiryId}")
    public ResponseEntity<ApiResponse<InquiryResponse>> getInquiry(
            @PathVariable Long inquiryId) {
        InquiryResponse inquiry = adminService.getInquiry(inquiryId);
        return ResponseEntity.ok(ApiResponse.success(inquiry));
    }

    /**
     * 問い合わせステータス更新
     */
    @PutMapping("/inquiries/{inquiryId}/status")
    public ResponseEntity<ApiResponse<InquiryResponse>> updateInquiryStatus(
            @PathVariable Long inquiryId,
            @Valid @RequestBody InquiryStatusUpdateRequest request) {
        InquiryResponse inquiry = adminService.updateInquiryStatus(inquiryId, request);
        return ResponseEntity.ok(ApiResponse.success("ステータスを更新しました", inquiry));
    }

    // ========== システム監視 ==========

    /**
     * システムメトリクス取得
     */
    @GetMapping("/system/metrics")
    public ResponseEntity<ApiResponse<SystemMetricsResponse>> getSystemMetrics() {
        SystemMetricsResponse metrics = adminService.getSystemMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }
}
