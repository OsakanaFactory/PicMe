package com.picme.backend.exception;

import com.picme.backend.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * グローバル例外ハンドラー
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * カスタムAPI例外のハンドリング
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException ex) {
        log.error("API Exception: {} - {}", ex.getErrorCode(), ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
                ex.getErrorCode(),
                ex.getMessage(),
                ex.getDetails());

        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    /**
     * バリデーションエラーのハンドリング
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation errors: {}", errors);

        ApiResponse<Void> response = ApiResponse.error(
                "VALIDATION_ERROR",
                "入力内容に誤りがあります",
                errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * 認証エラーのハンドリング
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(
            BadCredentialsException ex) {

        log.warn("Bad credentials: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
                "INVALID_CREDENTIALS",
                "メールアドレスまたはパスワードが間違っています");

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * その他の例外のハンドリング
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        log.error("Unexpected error occurred", ex);

        ApiResponse<Void> response = ApiResponse.error(
                "INTERNAL_ERROR",
                "サーバーエラーが発生しました。しばらく経ってから再度お試しください。");

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
