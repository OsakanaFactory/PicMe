package com.picme.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * カテゴリーリクエストDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @NotBlank(message = "カテゴリー名は必須です")
    @Size(max = 100, message = "カテゴリー名は100文字以内で入力してください")
    private String name;

    private Integer displayOrder;
}
