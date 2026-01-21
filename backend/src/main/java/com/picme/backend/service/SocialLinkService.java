package com.picme.backend.service;

import com.picme.backend.dto.request.SocialLinkReorderRequest;
import com.picme.backend.dto.request.SocialLinkRequest;
import com.picme.backend.dto.response.SocialLinkResponse;

import java.util.List;

/**
 * SNSリンクサービスインターフェース
 */
public interface SocialLinkService {

    /**
     * ユーザーのSNSリンク一覧を取得
     */
    List<SocialLinkResponse> getSocialLinks(String email);

    /**
     * SNSリンクを作成
     */
    SocialLinkResponse createSocialLink(String email, SocialLinkRequest request);

    /**
     * SNSリンクを更新
     */
    SocialLinkResponse updateSocialLink(String email, Long linkId, SocialLinkRequest request);

    /**
     * SNSリンクを削除
     */
    void deleteSocialLink(String email, Long linkId);

    /**
     * SNSリンクの並び順を更新
     */
    void reorderSocialLinks(String email, SocialLinkReorderRequest request);

    /**
     * 公開SNSリンクを取得
     */
    List<SocialLinkResponse> getPublicSocialLinks(String username);
}
