package com.picme.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.picme.backend.config.CloudinaryConfig;
import com.picme.backend.exception.ApiException;
import com.picme.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Cloudinary画像アップロードサービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;
    private final CloudinaryConfig cloudinaryConfig;

    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Override
    public CloudinaryUploadResult uploadImage(MultipartFile file, String folder, Long userId) {
        validateFile(file);

        if (!cloudinaryConfig.isConfigured()) {
            log.warn("Cloudinaryが未設定のため、アップロードをスキップします");
            throw ApiException.badRequest("画像アップロード機能が設定されていません");
        }

        try {
            String uploadFolder = "picme/" + userId + "/" + folder;

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", uploadFolder,
                    "resource_type", "image",
                    "quality", "auto:good",
                    "fetch_format", "auto"
            ));

            String publicId = (String) uploadResult.get("public_id");
            String secureUrl = (String) uploadResult.get("secure_url");
            long bytes = ((Number) uploadResult.get("bytes")).longValue();
            int width = ((Number) uploadResult.get("width")).intValue();
            int height = ((Number) uploadResult.get("height")).intValue();

            String thumbnailUrl = getThumbnailUrl(publicId, 400);

            log.info("画像アップロード成功: publicId={}, size={}bytes, user={}", publicId, bytes, userId);

            return new CloudinaryUploadResult(publicId, secureUrl, thumbnailUrl, bytes, width, height);

        } catch (IOException e) {
            log.error("画像アップロード失敗: {}", e.getMessage(), e);
            throw ApiException.badRequest("画像のアップロードに失敗しました");
        }
    }

    @Override
    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isEmpty()) {
            return;
        }

        if (!cloudinaryConfig.isConfigured()) {
            log.warn("Cloudinaryが未設定のため、削除をスキップします");
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("画像削除成功: publicId={}", publicId);
        } catch (IOException e) {
            log.error("画像削除失敗: publicId={}, error={}", publicId, e.getMessage());
        }
    }

    @Override
    public String getOptimizedUrl(String publicId, int width, int quality) {
        return cloudinary.url()
                .transformation(new Transformation<>()
                        .width(width)
                        .crop("limit")
                        .quality(quality)
                        .fetchFormat("auto"))
                .secure(true)
                .generate(publicId);
    }

    @Override
    public String getThumbnailUrl(String publicId, int width) {
        return cloudinary.url()
                .transformation(new Transformation<>()
                        .width(width)
                        .height(width)
                        .crop("fill")
                        .gravity("auto")
                        .quality("auto:good")
                        .fetchFormat("auto"))
                .secure(true)
                .generate(publicId);
    }

    /**
     * ファイルのバリデーション
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("ファイルが選択されていません");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw ApiException.badRequest(
                    String.format("ファイルサイズが上限（%dMB）を超えています", MAX_FILE_SIZE / (1024 * 1024)));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw ApiException.badRequest("対応していないファイル形式です。JPG, PNG, GIF, WebPが使用できます");
        }
    }
}
