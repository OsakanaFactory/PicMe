package com.picme.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * お知らせ投稿リクエストDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 200, message = "タイトルは200文字以内で入力してください")
    private String title;

    @NotBlank(message = "本文は必須です")
    private String content;

    @Size(max = 500, message = "サムネイルURLは500文字以内で入力してください")
    private String thumbnailUrl;

    @Builder.Default
    private Boolean visible = true;
}
