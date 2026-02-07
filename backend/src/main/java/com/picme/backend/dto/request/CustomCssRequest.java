package com.picme.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * カスタムCSS更新リクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomCssRequest {

    @Size(max = 10000, message = "CSSは10000文字以内にしてください")
    private String customCss;
}
