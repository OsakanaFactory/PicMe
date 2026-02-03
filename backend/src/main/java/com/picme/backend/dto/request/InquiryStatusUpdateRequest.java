package com.picme.backend.dto.request;

import com.picme.backend.model.InquiryStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 問い合わせステータス更新リクエスト
 */
@Data
public class InquiryStatusUpdateRequest {

    @NotNull(message = "ステータスは必須です")
    private InquiryStatus status;

    private String adminNote;
}
