package com.picme.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * SNSリンク並び替えリクエストDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLinkReorderRequest {

    @NotEmpty(message = "並び替えデータは必須です")
    @Valid
    private List<OrderItem> orders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        @NotNull(message = "リンクIDは必須です")
        private Long id;

        @NotNull(message = "表示順は必須です")
        private Integer order;
    }
}
