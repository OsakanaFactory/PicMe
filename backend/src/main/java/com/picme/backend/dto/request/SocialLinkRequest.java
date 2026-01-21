package com.picme.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

/**
 * SNSリンク作成・更新リクエストDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLinkRequest {

    @NotBlank(message = "プラットフォームは必須です")
    @Size(max = 50, message = "プラットフォーム名は50文字以内で入力してください")
    private String platform;

    @NotBlank(message = "URLは必須です")
    @URL(message = "有効なURLを入力してください")
    @Size(max = 500, message = "URLは500文字以内で入力してください")
    private String url;

    @Size(max = 100, message = "アイコン名は100文字以内で入力してください")
    private String icon;

    private Boolean visible;
}
