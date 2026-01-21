package com.picme.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * カスタムAPI例外クラス
 */
@Getter
public class ApiException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus httpStatus;
    private final Object details;

    public ApiException(String errorCode, String message, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.details = null;
    }

    public ApiException(String errorCode, String message, HttpStatus httpStatus, Object details) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.details = details;
    }

    // 事前定義されたエラー
    public static ApiException usernameAlreadyExists() {
        return new ApiException(
                "USERNAME_ALREADY_EXISTS",
                "このユーザー名は既に使用されています",
                HttpStatus.CONFLICT);
    }

    public static ApiException emailAlreadyExists() {
        return new ApiException(
                "EMAIL_ALREADY_EXISTS",
                "このメールアドレスは既に使用されています",
                HttpStatus.CONFLICT);
    }

    public static ApiException invalidCredentials() {
        return new ApiException(
                "INVALID_CREDENTIALS",
                "メールアドレスまたはパスワードが間違っています",
                HttpStatus.UNAUTHORIZED);
    }

    public static ApiException userNotFound() {
        return new ApiException(
                "USER_NOT_FOUND",
                "ユーザーが見つかりません",
                HttpStatus.NOT_FOUND);
    }

    public static ApiException accountDisabled() {
        return new ApiException(
                "ACCOUNT_DISABLED",
                "アカウントが無効化されています",
                HttpStatus.FORBIDDEN);
    }

    public static ApiException invalidToken() {
        return new ApiException(
                "INVALID_TOKEN",
                "無効なトークンです",
                HttpStatus.UNAUTHORIZED);
    }

    public static ApiException tokenExpired() {
        return new ApiException(
                "TOKEN_EXPIRED",
                "トークンの有効期限が切れています",
                HttpStatus.UNAUTHORIZED);
    }

    public static ApiException unauthorized() {
        return new ApiException(
                "UNAUTHORIZED",
                "認証が必要です",
                HttpStatus.UNAUTHORIZED);
    }

    public static ApiException forbidden() {
        return new ApiException(
                "FORBIDDEN",
                "アクセス権限がありません",
                HttpStatus.FORBIDDEN);
    }

    public static ApiException notFound(String resource) {
        return new ApiException(
                "NOT_FOUND",
                resource + "が見つかりません",
                HttpStatus.NOT_FOUND);
    }

    public static ApiException limitExceeded(String message) {
        return new ApiException(
                "LIMIT_EXCEEDED",
                message,
                HttpStatus.FORBIDDEN);
    }
}
