package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * プロフィールレスポンスDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private Long userId;
    private String username;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private String headerUrl;
    private String theme;
    private String colorPrimary;
    private String colorAccent;
    private String fontFamily;
    private String layout;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
