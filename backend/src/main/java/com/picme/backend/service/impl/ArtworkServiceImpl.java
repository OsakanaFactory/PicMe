package com.picme.backend.service.impl;

import com.picme.backend.dto.request.ArtworkReorderRequest;
import com.picme.backend.dto.request.ArtworkRequest;
import com.picme.backend.dto.response.ArtworkResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.Artwork;
import com.picme.backend.model.Category;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.Tag;
import com.picme.backend.model.User;
import com.picme.backend.repository.ArtworkRepository;
import com.picme.backend.repository.CategoryRepository;
import com.picme.backend.repository.TagRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.ArtworkService;
import com.picme.backend.service.CloudinaryService;
import com.picme.backend.service.CloudinaryService.CloudinaryUploadResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 作品サービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ArtworkServiceImpl implements ArtworkService {

    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ArtworkResponse> getArtworks(String email) {
        User user = getUserByEmail(email);

        return artworkRepository.findByUserIdOrderByDisplayOrderAsc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ArtworkResponse getArtwork(String email, Long artworkId) {
        User user = getUserByEmail(email);

        Artwork artwork = artworkRepository.findByIdAndUserId(artworkId, user.getId())
                .orElseThrow(() -> ApiException.notFound("作品"));

        return mapToResponse(artwork);
    }

    @Override
    @Transactional
    public ArtworkResponse createArtwork(String email, ArtworkRequest request) {
        User user = getUserByEmail(email);

        // プラン制限チェック
        checkArtworkLimit(user);

        // 現在の作品数から表示順を決定
        long currentCount = artworkRepository.countByUserId(user.getId());

        Artwork artwork = Artwork.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .thumbnailUrl(request.getThumbnailUrl())
                .category(request.getCategory())
                .displayOrder((int) currentCount)
                .visible(request.getVisible() != null ? request.getVisible() : true)
                .build();

        artwork = artworkRepository.save(artwork);

        log.info("Artwork created: {} for user: {}", artwork.getId(), email);

        return mapToResponse(artwork);
    }

    @Override
    @Transactional
    public ArtworkResponse updateArtwork(String email, Long artworkId, ArtworkRequest request) {
        User user = getUserByEmail(email);

        Artwork artwork = artworkRepository.findByIdAndUserId(artworkId, user.getId())
                .orElseThrow(() -> ApiException.notFound("作品"));

        // 更新可能なフィールドを更新
        if (request.getTitle() != null) {
            artwork.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            artwork.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            artwork.setImageUrl(request.getImageUrl());
        }
        if (request.getThumbnailUrl() != null) {
            artwork.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getCategory() != null) {
            artwork.setCategory(request.getCategory());
        }
        if (request.getVisible() != null) {
            artwork.setVisible(request.getVisible());
        }

        artwork = artworkRepository.save(artwork);

        log.info("Artwork updated: {} for user: {}", artwork.getId(), email);

        return mapToResponse(artwork);
    }

    @Override
    @Transactional
    public ArtworkResponse createArtworkWithUpload(String email, MultipartFile file,
                                                    String title, String description,
                                                    Long categoryId, List<Long> tagIds) {
        User user = getUserByEmail(email);

        // プラン制限チェック（作品数）
        checkArtworkLimit(user);

        // ストレージ制限チェック
        checkStorageLimit(user, file.getSize());

        // Cloudinaryにアップロード
        CloudinaryUploadResult uploadResult = cloudinaryService.uploadImage(file, "artworks", user.getId());

        // カテゴリーの取得
        Category category = null;
        if (categoryId != null) {
            category = categoryRepository.findByIdAndUser(categoryId, user)
                    .orElse(null);
        }

        // タグの取得
        Set<Tag> tags = new HashSet<>();
        if (tagIds != null && !tagIds.isEmpty()) {
            tags = new HashSet<>(tagRepository.findAllById(tagIds));
        }

        // 現在の作品数から表示順を決定
        long currentCount = artworkRepository.countByUserId(user.getId());

        Artwork artwork = Artwork.builder()
                .user(user)
                .title(title)
                .description(description)
                .imageUrl(uploadResult.secureUrl())
                .thumbnailUrl(uploadResult.thumbnailUrl())
                .cloudinaryPublicId(uploadResult.publicId())
                .fileSize(uploadResult.bytes())
                .categoryEntity(category)
                .tags(tags)
                .displayOrder((int) currentCount)
                .visible(true)
                .build();

        artwork = artworkRepository.save(artwork);

        log.info("Artwork created with upload: {} for user: {}", artwork.getId(), email);

        return mapToResponse(artwork);
    }

    @Override
    @Transactional
    public void deleteArtwork(String email, Long artworkId) {
        User user = getUserByEmail(email);

        Artwork artwork = artworkRepository.findByIdAndUserId(artworkId, user.getId())
                .orElseThrow(() -> ApiException.notFound("作品"));

        // Cloudinaryから画像を削除
        if (artwork.getCloudinaryPublicId() != null) {
            cloudinaryService.deleteImage(artwork.getCloudinaryPublicId());
        }

        artworkRepository.delete(artwork);

        log.info("Artwork deleted: {} for user: {}", artworkId, email);
    }

    @Override
    @Transactional
    public void reorderArtworks(String email, ArtworkReorderRequest request) {
        User user = getUserByEmail(email);

        for (ArtworkReorderRequest.OrderItem item : request.getOrders()) {
            artworkRepository.updateDisplayOrder(item.getId(), user.getId(), item.getOrder());
        }

        log.info("Artworks reordered for user: {}", email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ArtworkResponse> getPublicArtworks(String username) {
        return artworkRepository.findPublicArtworksByUsername(username)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * メールアドレスでユーザーを取得
     */
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(ApiException::userNotFound);
    }

    /**
     * 作品数の制限をチェック
     */
    private void checkArtworkLimit(User user) {
        long currentCount = artworkRepository.countByUserId(user.getId());
        int limit = getArtworkLimit(user.getPlanType());

        if (currentCount >= limit) {
            throw ApiException.limitExceeded(
                    String.format("作品数の上限（%d枚）に達しています。プランをアップグレードしてください。", limit));
        }
    }

    /**
     * プランごとの作品数上限を取得
     */
    private int getArtworkLimit(PlanType planType) {
        return switch (planType) {
            case FREE -> 5;
            case STARTER -> 20;
            case PRO -> 50;
            case STUDIO -> 200;
        };
    }

    /**
     * ストレージ使用量の制限をチェック
     */
    private void checkStorageLimit(User user, long additionalBytes) {
        long currentUsage = artworkRepository.sumFileSizeByUserId(user.getId());
        long limitBytes = getStorageLimitBytes(user.getPlanType());

        if (currentUsage + additionalBytes > limitBytes) {
            long limitMb = limitBytes / (1024 * 1024);
            throw ApiException.limitExceeded(
                    String.format("ストレージの上限（%dMB）に達しています。プランをアップグレードしてください。", limitMb));
        }
    }

    /**
     * プランごとのストレージ上限（バイト）を取得
     */
    private long getStorageLimitBytes(PlanType planType) {
        return switch (planType) {
            case FREE -> 300L * 1024 * 1024;     // 300MB
            case STARTER -> 1024L * 1024 * 1024;  // 1GB
            case PRO -> 2048L * 1024 * 1024;      // 2GB
            case STUDIO -> 10240L * 1024 * 1024;   // 10GB
        };
    }

    /**
     * ArtworkエンティティをArtworkResponseにマッピング
     */
    private ArtworkResponse mapToResponse(Artwork artwork) {
        Long categoryId = artwork.getCategoryEntity() != null ? artwork.getCategoryEntity().getId() : null;
        List<Long> tagIds = artwork.getTags() != null
                ? artwork.getTags().stream().map(tag -> tag.getId()).collect(Collectors.toList())
                : Collections.emptyList();

        return ArtworkResponse.builder()
                .id(artwork.getId())
                .title(artwork.getTitle())
                .description(artwork.getDescription())
                .imageUrl(artwork.getImageUrl())
                .thumbnailUrl(artwork.getThumbnailUrl())
                .category(artwork.getCategory())
                .categoryId(categoryId)
                .tagIds(tagIds)
                .displayOrder(artwork.getDisplayOrder())
                .visible(artwork.getVisible())
                .createdAt(artwork.getCreatedAt())
                .updatedAt(artwork.getUpdatedAt())
                .build();
    }
}
