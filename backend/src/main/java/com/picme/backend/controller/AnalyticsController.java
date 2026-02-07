package com.picme.backend.controller;

import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * アクセス解析コントローラー
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * 解析サマリーを取得
     * GET /api/analytics/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> summary = analyticsService.getSummary(email);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    /**
     * 日別タイムラインデータを取得
     * GET /api/analytics/timeline?days=30
     */
    @GetMapping("/timeline")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTimeline(
            Authentication authentication,
            @RequestParam(defaultValue = "30") int days) {
        String email = authentication.getName();
        List<Map<String, Object>> timeline = analyticsService.getTimeline(email, Math.min(days, 90));
        return ResponseEntity.ok(ApiResponse.success(timeline));
    }
}
