package com.picme.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 作品作成・更新リクエストDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtworkRequest {

    @Size(max = 200, message = "タイトルは200文字以内で入力してください")
    private String title;

    @Size(max = 1000, message = "説明は1000文字以内で入力してください")
    private String description;

    @NotBlank(message = "画像URLは必須です")
    private String imageUrl;

    private String thumbnailUrl;

    @Size(max = 50, message = "カテゴリーは50文字以内で入力してください")
    private String category;

    private Boolean visible;
}
