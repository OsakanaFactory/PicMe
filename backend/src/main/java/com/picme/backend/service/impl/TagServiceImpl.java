package com.picme.backend.service.impl;

import com.picme.backend.dto.response.TagResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.Tag;
import com.picme.backend.model.User;
import com.picme.backend.repository.TagRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.TagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * タグサービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getTags(String email) {
        User user = getUserByEmail(email);
        checkTagFeatureAvailable(user);

        return tagRepository.findByUserOrderByNameAsc(user)
                .stream()
                .map(TagResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TagResponse createTag(String email, String tagName) {
        User user = getUserByEmail(email);
        checkTagFeatureAvailable(user);

        // 既存のタグがあればそれを返す
        return tagRepository.findByUserAndName(user, tagName)
                .map(TagResponse::fromEntity)
                .orElseGet(() -> {
                    Tag tag = Tag.builder()
                            .user(user)
                            .name(tagName)
                            .build();
                    tag = tagRepository.save(tag);

                    log.info("Tag created: {} for user: {}", tag.getId(), email);

                    return TagResponse.fromEntity(tag);
                });
    }

    @Override
    @Transactional
    public void deleteTag(String email, Long tagId) {
        User user = getUserByEmail(email);
        checkTagFeatureAvailable(user);

        Tag tag = tagRepository.findByIdAndUser(tagId, user)
                .orElseThrow(() -> ApiException.notFound("タグ"));

        tagRepository.delete(tag);

        log.info("Tag deleted: {} for user: {}", tagId, email);
    }

    @Override
    @Transactional
    public List<TagResponse> getOrCreateTags(String email, Set<String> tagNames) {
        User user = getUserByEmail(email);
        checkTagFeatureAvailable(user);

        List<TagResponse> result = new ArrayList<>();

        // 既存のタグを取得
        List<Tag> existingTags = tagRepository.findByUserAndNameIn(user, tagNames);
        Set<String> existingNames = existingTags.stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());

        // 既存のタグをレスポンスに追加
        existingTags.forEach(tag -> result.add(TagResponse.fromEntity(tag)));

        // 新しいタグを作成
        for (String tagName : tagNames) {
            if (!existingNames.contains(tagName)) {
                Tag tag = Tag.builder()
                        .user(user)
                        .name(tagName)
                        .build();
                tag = tagRepository.save(tag);
                result.add(TagResponse.fromEntity(tag));

                log.info("Tag created: {} for user: {}", tag.getId(), email);
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getPublicTags(String username) {
        return tagRepository.findByUsername(username)
                .stream()
                .map(TagResponse::fromEntity)
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
     * タグ機能が利用可能かチェック（Pro以上）
     */
    private void checkTagFeatureAvailable(User user) {
        if (user.getPlanType() != PlanType.PRO && user.getPlanType() != PlanType.STUDIO) {
            throw ApiException.forbidden("タグ機能はProプラン以上でご利用いただけます");
        }
    }
}
