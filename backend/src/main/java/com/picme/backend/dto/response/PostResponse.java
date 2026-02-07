package com.picme.backend.dto.response;

import com.picme.backend.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * お知らせ投稿レスポンスDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private String contentFormat;
    private String contentHtml;
    private String thumbnailUrl;
    private Boolean visible;
    private Integer viewCount;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * エンティティからレスポンスDTOを生成
     */
    public static PostResponse fromEntity(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .contentFormat(post.getContentFormat())
                .contentHtml(null) // Markdown変換はService層で行う
                .thumbnailUrl(post.getThumbnailUrl())
                .visible(post.getVisible())
                .viewCount(post.getViewCount())
                .publishedAt(post.getPublishedAt())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    /**
     * エンティティからレスポンスDTOを生成（HTML変換済み）
     */
    public static PostResponse fromEntity(Post post, String contentHtml) {
        PostResponse response = fromEntity(post);
        response.setContentHtml(contentHtml);
        return response;
    }
}
