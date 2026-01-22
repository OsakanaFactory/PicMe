package com.picme.backend.service.impl;

import com.picme.backend.dto.request.CategoryRequest;
import com.picme.backend.dto.response.CategoryResponse;
import com.picme.backend.exception.ApiException;
import com.picme.backend.model.Category;
import com.picme.backend.model.PlanType;
import com.picme.backend.model.User;
import com.picme.backend.repository.CategoryRepository;
import com.picme.backend.repository.UserRepository;
import com.picme.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * カテゴリーサービス実装
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(String email) {
        User user = getUserByEmail(email);
        checkCategoryFeatureAvailable(user);

        return categoryRepository.findByUserOrderByDisplayOrderAsc(user)
                .stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategory(String email, Long categoryId) {
        User user = getUserByEmail(email);
        checkCategoryFeatureAvailable(user);

        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> ApiException.notFound("カテゴリー"));

        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(String email, CategoryRequest request) {
        User user = getUserByEmail(email);
        checkCategoryFeatureAvailable(user);

        // 現在のカテゴリー数から表示順を決定
        long currentCount = categoryRepository.countByUser(user);

        Category category = Category.builder()
                .user(user)
                .name(request.getName())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) currentCount)
                .build();

        category = categoryRepository.save(category);

        log.info("Category created: {} for user: {}", category.getId(), email);

        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(String email, Long categoryId, CategoryRequest request) {
        User user = getUserByEmail(email);
        checkCategoryFeatureAvailable(user);

        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> ApiException.notFound("カテゴリー"));

        if (request.getName() != null) {
            category.setName(request.getName());
        }
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }

        category = categoryRepository.save(category);

        log.info("Category updated: {} for user: {}", category.getId(), email);

        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional
    public void deleteCategory(String email, Long categoryId) {
        User user = getUserByEmail(email);
        checkCategoryFeatureAvailable(user);

        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> ApiException.notFound("カテゴリー"));

        categoryRepository.delete(category);

        log.info("Category deleted: {} for user: {}", categoryId, email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getPublicCategories(String username) {
        return categoryRepository.findByUsername(username)
                .stream()
                .map(CategoryResponse::fromEntity)
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
     * カテゴリー機能が利用可能かチェック（Pro以上）
     */
    private void checkCategoryFeatureAvailable(User user) {
        if (user.getPlanType() != PlanType.PRO && user.getPlanType() != PlanType.STUDIO) {
            throw ApiException.forbidden("カテゴリー機能はProプラン以上でご利用いただけます");
        }
    }
}
