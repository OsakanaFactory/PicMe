package com.picme.backend.service;

import com.picme.backend.dto.request.CategoryRequest;
import com.picme.backend.dto.response.CategoryResponse;

import java.util.List;

/**
 * カテゴリーサービスインターフェース
 */
public interface CategoryService {

    /**
     * ユーザーのカテゴリー一覧を取得
     */
    List<CategoryResponse> getCategories(String email);

    /**
     * カテゴリーを取得
     */
    CategoryResponse getCategory(String email, Long categoryId);

    /**
     * カテゴリーを作成
     */
    CategoryResponse createCategory(String email, CategoryRequest request);

    /**
     * カテゴリーを更新
     */
    CategoryResponse updateCategory(String email, Long categoryId, CategoryRequest request);

    /**
     * カテゴリーを削除
     */
    void deleteCategory(String email, Long categoryId);

    /**
     * 公開カテゴリーを取得（公開ページ用）
     */
    List<CategoryResponse> getPublicCategories(String username);
}
