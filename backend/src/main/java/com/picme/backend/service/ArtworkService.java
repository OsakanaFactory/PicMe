package com.picme.backend.service;

import com.picme.backend.dto.request.ArtworkReorderRequest;
import com.picme.backend.dto.request.ArtworkRequest;
import com.picme.backend.dto.response.ArtworkResponse;

import java.util.List;

/**
 * 作品サービスインターフェース
 */
public interface ArtworkService {

    /**
     * ユーザーの作品一覧を取得
     */
    List<ArtworkResponse> getArtworks(String email);

    /**
     * 作品を取得
     */
    ArtworkResponse getArtwork(String email, Long artworkId);

    /**
     * 作品を作成
     */
    ArtworkResponse createArtwork(String email, ArtworkRequest request);

    /**
     * 作品を更新
     */
    ArtworkResponse updateArtwork(String email, Long artworkId, ArtworkRequest request);

    /**
     * 作品を削除
     */
    void deleteArtwork(String email, Long artworkId);

    /**
     * 作品の並び順を更新
     */
    void reorderArtworks(String email, ArtworkReorderRequest request);

    /**
     * 公開作品を取得
     */
    List<ArtworkResponse> getPublicArtworks(String username);
}
