package com.picme.backend.service;

/**
 * メール送信サービスインターフェース
 */
public interface EmailService {

    /**
     * メール認証メールを送信
     *
     * @param to    送信先メールアドレス
     * @param token 認証トークン
     */
    void sendVerificationEmail(String to, String token);

    /**
     * パスワードリセットメールを送信
     *
     * @param to    送信先メールアドレス
     * @param token リセットトークン
     */
    void sendPasswordResetEmail(String to, String token);

    /**
     * 問い合わせ通知メールを送信（v4.4で使用）
     *
     * @param to          送信先メールアドレス
     * @param senderName  問い合わせ者名
     * @param senderEmail 問い合わせ者メール
     * @param subject     件名
     * @param message     メッセージ本文
     */
    void sendInquiryNotification(String to, String senderName, String senderEmail, String subject, String message);
}
