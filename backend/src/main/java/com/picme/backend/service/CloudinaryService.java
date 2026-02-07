package com.picme.backend.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Cloudinary画像アップロードサービスインターフェース
 */
public interface CloudinaryService {

    /**
     * 画像をアップロード
     *
     * @param file   アップロードするファイル
     * @param folder Cloudinary上のフォルダ（例: "avatars", "headers", "artworks"）
     * @param userId ユーザーID（フォルダ分けに使用）
     * @return アップロード結果
     */
    CloudinaryUploadResult uploadImage(MultipartFile file, String folder, Long userId);

    /**
     * 画像を削除
     *
     * @param publicId CloudinaryのpublicId
     */
    void deleteImage(String publicId);

    /**
     * 最適化されたURLを取得
     */
    String getOptimizedUrl(String publicId, int width, int quality);

    /**
     * サムネイルURLを取得
     */
    String getThumbnailUrl(String publicId, int width);

    /**
     * アップロード結果DTO
     */
    record CloudinaryUploadResult(
            String publicId,
            String secureUrl,
            String thumbnailUrl,
            long bytes,
            int width,
            int height
    ) {}
}
