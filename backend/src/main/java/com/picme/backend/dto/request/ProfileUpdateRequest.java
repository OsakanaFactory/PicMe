package com.picme.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * プロフィール更新リクエストDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {

    @Size(max = 100, message = "表示名は100文字以内で入力してください")
    private String displayName;

    @Size(max = 500, message = "自己紹介は500文字以内で入力してください")
    private String bio;

    private String avatarUrl;

    private String headerUrl;

    @Size(max = 50, message = "テーマ名は50文字以内で入力してください")
    private String theme;

    private String colorPrimary;

    private String colorAccent;

    @Size(max = 50, message = "フォント名は50文字以内で入力してください")
    private String fontFamily;

    private String layout;
}
