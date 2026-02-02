package com.picme.backend.model;

/**
 * サブスクリプションのステータスを定義するenum
 */
public enum SubscriptionStatus {
    ACTIVE,          // 有効
    PAST_DUE,        // 支払い遅延
    CANCELED,        // キャンセル済み
    INCOMPLETE,      // 未完了（初回決済待ち）
    TRIALING         // トライアル中
}
