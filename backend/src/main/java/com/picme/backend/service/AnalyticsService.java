package com.picme.backend.service;

import com.picme.backend.model.User;

import java.util.List;
import java.util.Map;

/**
 * アクセス解析サービスインターフェース
 */
public interface AnalyticsService {

    /**
     * ページビューを記録
     */
    void recordPageView(User user, String visitorIp, String referrer, String userAgent);

    /**
     * 解析サマリーを取得
     */
    Map<String, Object> getSummary(String email);

    /**
     * 日別タイムラインデータを取得
     */
    List<Map<String, Object>> getTimeline(String email, int days);
}
