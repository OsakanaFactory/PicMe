package com.picme.backend.dto.request;

import com.picme.backend.model.PlanType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Checkoutセッション作成リクエスト
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    @NotNull(message = "プランタイプは必須です")
    private PlanType planType;
}
