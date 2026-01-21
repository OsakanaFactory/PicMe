package com.picme.backend.service.impl;

import com.picme.backend.dto.request.ArtworkReorderRequest;
import com.picme.backend.dto.request.ArtworkRequest;
import com.picme.backend.dto.response.ArtworkResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.Artwork;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.User;
import com.picme.backend.repository.ArtworkRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.ArtworkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    public void deleteArtwork(String email, Long artworkId) {
        User user = getUserByEmail(email);

        Artwork artwork = artworkRepository.findByIdAndUserId(artworkId, user.getId())
                .orElseThrow(() -> ApiException.notFound("作品"));

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
     * ArtworkエンティティをArtworkResponseにマッピング
     */
    private ArtworkResponse mapToResponse(Artwork artwork) {
        return ArtworkResponse.builder()
                .id(artwork.getId())
                .title(artwork.getTitle())
                .description(artwork.getDescription())
                .imageUrl(artwork.getImageUrl())
                .thumbnailUrl(artwork.getThumbnailUrl())
                .category(artwork.getCategory())
                .displayOrder(artwork.getDisplayOrder())
                .visible(artwork.getVisible())
                .createdAt(artwork.getCreatedAt())
                .updatedAt(artwork.getUpdatedAt())
                .build();
    }
}
