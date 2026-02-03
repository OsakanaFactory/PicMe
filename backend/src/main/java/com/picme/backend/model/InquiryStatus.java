package com.picme.backend.model;

/**
 * 問い合わせステータス
 */
public enum InquiryStatus {
    PENDING,        // 未対応
    IN_PROGRESS,    // 対応中
    RESOLVED,       // 解決済み
    CLOSED          // クローズ
}
