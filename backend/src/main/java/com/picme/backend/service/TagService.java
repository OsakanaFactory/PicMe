package com.picme.backend.service;

import com.picme.backend.dto.response.TagResponse;

import java.util.List;
import java.util.Set;

/**
 * タグサービスインターフェース
 */
public interface TagService {

    /**
     * ユーザーのタグ一覧を取得
     */
    List<TagResponse> getTags(String email);

    /**
     * タグを作成
     */
    TagResponse createTag(String email, String tagName);

    /**
     * タグを削除
     */
    void deleteTag(String email, Long tagId);

    /**
     * タグを名前で取得または作成
     */
    List<TagResponse> getOrCreateTags(String email, Set<String> tagNames);

    /**
     * 公開タグを取得（公開ページ用）
     */
    List<TagResponse> getPublicTags(String username);
}
