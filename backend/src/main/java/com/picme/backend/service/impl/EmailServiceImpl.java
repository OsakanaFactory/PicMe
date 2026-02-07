package com.picme.backend.service.impl;

import com.picme.backend.config.SendGridConfig;
import com.picme.backend.service.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * メール送信サービス実装
 * SendGrid未設定時はコンソールにURL出力（開発用フォールバック）
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final SendGridConfig sendGridConfig;

    @Override
    public void sendVerificationEmail(String to, String token) {
        String verifyUrl = sendGridConfig.getFrontendUrl() + "/verify-email?token=" + token;

        String subject = "【PicMe】メールアドレスの認証";
        String body = "PicMeへのご登録ありがとうございます。\n\n"
                + "以下のリンクをクリックしてメールアドレスを認証してください：\n\n"
                + verifyUrl + "\n\n"
                + "このリンクは24時間有効です。\n\n"
                + "心当たりがない場合は、このメールを無視してください。";

        sendEmail(to, subject, body);
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = sendGridConfig.getFrontendUrl() + "/reset-password?token=" + token;

        String subject = "【PicMe】パスワードリセット";
        String body = "パスワードリセットのリクエストを受け付けました。\n\n"
                + "以下のリンクをクリックしてパスワードを再設定してください：\n\n"
                + resetUrl + "\n\n"
                + "このリンクは1時間有効です。\n\n"
                + "心当たりがない場合は、このメールを無視してください。";

        sendEmail(to, subject, body);
    }

    @Override
    public void sendInquiryNotification(String to, String senderName, String senderEmail, String subject, String message) {
        String emailSubject = "【PicMe】新しい問い合わせ: " + subject;
        String body = "新しい問い合わせが届きました。\n\n"
                + "送信者: " + senderName + " (" + senderEmail + ")\n"
                + "件名: " + subject + "\n\n"
                + "メッセージ:\n" + message;

        sendEmail(to, emailSubject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        if (!sendGridConfig.isConfigured()) {
            // 開発用フォールバック: コンソールに出力
            log.info("=== メール送信（開発モード） ===");
            log.info("To: {}", to);
            log.info("Subject: {}", subject);
            log.info("Body:\n{}", body);
            log.info("=== メール送信終了 ===");
            return;
        }

        try {
            Email from = new Email(sendGridConfig.getFromEmail(), sendGridConfig.getFromName());
            Email toEmail = new Email(to);
            Content content = new Content("text/plain", body);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(sendGridConfig.getApiKey());
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                log.error("SendGridメール送信失敗: status={}, body={}", response.getStatusCode(), response.getBody());
            } else {
                log.info("メール送信成功: to={}, subject={}", to, subject);
            }
        } catch (IOException e) {
            log.error("メール送信エラー: to={}, subject={}", to, subject, e);
        }
    }
}
