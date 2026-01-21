package com.picme.backend.service.impl;

import com.picme.backend.dto.request.SocialLinkReorderRequest;
import com.picme.backend.dto.request.SocialLinkRequest;
import com.picme.backend.dto.response.SocialLinkResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.SocialLink;
import com.picme.backend.model.User;
import com.picme.backend.repository.SocialLinkRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.SocialLinkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SNSリンクサービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SocialLinkServiceImpl implements SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SocialLinkResponse> getSocialLinks(String email) {
        User user = getUserByEmail(email);

        return socialLinkRepository.findByUserIdOrderByDisplayOrderAsc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SocialLinkResponse createSocialLink(String email, SocialLinkRequest request) {
        User user = getUserByEmail(email);

        // プラン制限チェック
        checkSocialLinkLimit(user);

        // 現在のリンク数から表示順を決定
        long currentCount = socialLinkRepository.countByUserId(user.getId());

        SocialLink socialLink = SocialLink.builder()
                .user(user)
                .platform(request.getPlatform())
                .url(request.getUrl())
                .icon(request.getIcon())
                .displayOrder((int) currentCount)
                .visible(request.getVisible() != null ? request.getVisible() : true)
                .build();

        socialLink = socialLinkRepository.save(socialLink);

        log.info("Social link created: {} for user: {}", socialLink.getId(), email);

        return mapToResponse(socialLink);
    }

    @Override
    @Transactional
    public SocialLinkResponse updateSocialLink(String email, Long linkId, SocialLinkRequest request) {
        User user = getUserByEmail(email);

        SocialLink socialLink = socialLinkRepository.findByIdAndUserId(linkId, user.getId())
                .orElseThrow(() -> ApiException.notFound("SNSリンク"));

        // 更新可能なフィールドを更新
        if (request.getPlatform() != null) {
            socialLink.setPlatform(request.getPlatform());
        }
        if (request.getUrl() != null) {
            socialLink.setUrl(request.getUrl());
        }
        if (request.getIcon() != null) {
            socialLink.setIcon(request.getIcon());
        }
        if (request.getVisible() != null) {
            socialLink.setVisible(request.getVisible());
        }

        socialLink = socialLinkRepository.save(socialLink);

        log.info("Social link updated: {} for user: {}", socialLink.getId(), email);

        return mapToResponse(socialLink);
    }

    @Override
    @Transactional
    public void deleteSocialLink(String email, Long linkId) {
        User user = getUserByEmail(email);

        SocialLink socialLink = socialLinkRepository.findByIdAndUserId(linkId, user.getId())
                .orElseThrow(() -> ApiException.notFound("SNSリンク"));

        socialLinkRepository.delete(socialLink);

        log.info("Social link deleted: {} for user: {}", linkId, email);
    }

    @Override
    @Transactional
    public void reorderSocialLinks(String email, SocialLinkReorderRequest request) {
        User user = getUserByEmail(email);

        for (SocialLinkReorderRequest.OrderItem item : request.getOrders()) {
            socialLinkRepository.updateDisplayOrder(item.getId(), user.getId(), item.getOrder());
        }

        log.info("Social links reordered for user: {}", email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocialLinkResponse> getPublicSocialLinks(String username) {
        return socialLinkRepository.findPublicLinksByUsername(username)
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
     * SNSリンク数の制限をチェック
     */
    private void checkSocialLinkLimit(User user) {
        long currentCount = socialLinkRepository.countByUserId(user.getId());
        int limit = getSocialLinkLimit(user.getPlanType());

        if (currentCount >= limit) {
            throw ApiException.limitExceeded(
                    String.format("SNSリンクの上限（%d個）に達しています。プランをアップグレードしてください。", limit));
        }
    }

    /**
     * プランごとのSNSリンク数上限を取得
     */
    private int getSocialLinkLimit(PlanType planType) {
        return switch (planType) {
            case FREE -> 2;
            case STARTER -> 5;
            case PRO -> 10;
            case STUDIO -> 20;
        };
    }

    /**
     * SocialLinkエンティティをSocialLinkResponseにマッピング
     */
    private SocialLinkResponse mapToResponse(SocialLink socialLink) {
        return SocialLinkResponse.builder()
                .id(socialLink.getId())
                .platform(socialLink.getPlatform())
                .url(socialLink.getUrl())
                .icon(socialLink.getIcon())
                .displayOrder(socialLink.getDisplayOrder())
                .visible(socialLink.getVisible())
                .createdAt(socialLink.getCreatedAt())
                .build();
    }
}
