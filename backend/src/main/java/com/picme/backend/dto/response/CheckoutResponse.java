package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Checkoutセッション作成レスポンス
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {

    private boolean success;
    private String sessionId;
    private String checkoutUrl;
    private String message;
}
