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

    @Size(max = 32, message = "表示名は32文字以内で入力してください")
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

    @Size(max = 20, message = "レイアウト名は20文字以内で入力してください")
    private String layout;
}
