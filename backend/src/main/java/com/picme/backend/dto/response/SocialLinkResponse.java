package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * SNSリンクレスポンスDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLinkResponse {

    private Long id;
    private String platform;
    private String url;
    private String icon;
    private Integer displayOrder;
    private Boolean visible;
    private LocalDateTime createdAt;
}
