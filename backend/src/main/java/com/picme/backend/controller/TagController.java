package com.picme.backend.controller;

import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.TagResponse;
import com.picme.backend.service.TagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * タグコントローラー
 */
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Slf4j
public class TagController {

    private final TagService tagService;

    /**
     * タグ一覧を取得
     * GET /api/tags
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponse>>> getTags(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Get tags request for: {}", userDetails.getUsername());

        List<TagResponse> tags = tagService.getTags(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(tags));
    }

    /**
     * タグを作成
     * POST /api/tags
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TagResponse>> createTag(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {

        String tagName = request.get("name");
        if (tagName == null || tagName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("タグ名は必須です"));
        }

        log.info("Create tag request for: {}", userDetails.getUsername());

        TagResponse tag = tagService.createTag(userDetails.getUsername(), tagName.trim());
        return new ResponseEntity<>(
                ApiResponse.success("タグを作成しました", tag),
                HttpStatus.CREATED);
    }

    /**
     * タグを削除
     * DELETE /api/tags/:id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTag(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Delete tag request: {} for: {}", id, userDetails.getUsername());

        tagService.deleteTag(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("タグを削除しました"));
    }
}
