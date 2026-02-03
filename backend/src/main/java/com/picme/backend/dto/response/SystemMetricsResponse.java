package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * システムメトリクスレスポンス
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemMetricsResponse {

    private ResourceUsage cpu;
    private ResourceUsage memory;
    private ResourceUsage disk;

    private DatabaseMetrics database;
    private ErrorMetrics errors;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResourceUsage {
        private double usagePercent;
        private String status; // normal, warning, critical
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatabaseMetrics {
        private int activeConnections;
        private int maxConnections;
        private double avgResponseTimeMs;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorMetrics {
        private long error5xx;
        private long error4xx;
        private String period; // 24h
    }
}
