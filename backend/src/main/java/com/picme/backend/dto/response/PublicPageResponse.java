package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 公開ページレスポンスDTO
 * ユーザーの公開プロフィール、作品、SNSリンク、お知らせ、カテゴリー、タグを含む
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicPageResponse {

    private ProfileResponse profile;
    private List<ArtworkResponse> artworks;
    private List<SocialLinkResponse> socialLinks;
    private List<PostResponse> posts;
    private List<CategoryResponse> categories;
    private List<TagResponse> tags;
    private Boolean contactFormEnabled;
    private String customCss;
}
