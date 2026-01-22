package com.picme.backend.controller;

import com.picme.backend.dto.request.CategoryRequest;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.CategoryResponse;
import com.picme.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * カテゴリーコントローラー
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * カテゴリー一覧を取得
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Get categories request for: {}", userDetails.getUsername());

        List<CategoryResponse> categories = categoryService.getCategories(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * カテゴリーを取得
     * GET /api/categories/:id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Get category request: {} for: {}", id, userDetails.getUsername());

        CategoryResponse category = categoryService.getCategory(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    /**
     * カテゴリーを作成
     * POST /api/categories
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CategoryRequest request) {

        log.info("Create category request for: {}", userDetails.getUsername());

        CategoryResponse category = categoryService.createCategory(userDetails.getUsername(), request);
        return new ResponseEntity<>(
                ApiResponse.success("カテゴリーを作成しました", category),
                HttpStatus.CREATED);
    }

    /**
     * カテゴリーを更新
     * PUT /api/categories/:id
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {

        log.info("Update category request: {} for: {}", id, userDetails.getUsername());

        CategoryResponse category = categoryService.updateCategory(
                userDetails.getUsername(), id, request);

        return ResponseEntity.ok(ApiResponse.success("カテゴリーを更新しました", category));
    }

    /**
     * カテゴリーを削除
     * DELETE /api/categories/:id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Delete category request: {} for: {}", id, userDetails.getUsername());

        categoryService.deleteCategory(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("カテゴリーを削除しました"));
    }
}
