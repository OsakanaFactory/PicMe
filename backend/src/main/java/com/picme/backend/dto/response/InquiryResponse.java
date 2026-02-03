package com.picme.backend.dto.response;

import com.picme.backend.model.InquiryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 問い合わせレスポンス
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InquiryResponse {

    private Long id;
    private Long userId;
    private String username;
    private String name;
    private String email;
    private String subject;
    private String message;
    private InquiryStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
