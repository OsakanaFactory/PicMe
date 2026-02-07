package com.picme.backend.controller;

import com.picme.backend.dto.request.ArtworkReorderRequest;
import com.picme.backend.dto.request.ArtworkRequest;
import com.picme.backend.dto.response.ApiResponse;
import com.picme.backend.dto.response.ArtworkResponse;
import com.picme.backend.service.ArtworkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 作品コントローラー
 */
@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
@Slf4j
public class ArtworkController {

    private final ArtworkService artworkService;

    /**
     * 作品一覧を取得
     * GET /api/artworks
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ArtworkResponse>>> getArtworks(
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Get artworks request for: {}", userDetails.getUsername());

        List<ArtworkResponse> artworks = artworkService.getArtworks(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(artworks));
    }

    /**
     * 作品を取得
     * GET /api/artworks/:id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArtworkResponse>> getArtwork(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Get artwork request: {} for: {}", id, userDetails.getUsername());

        ArtworkResponse artwork = artworkService.getArtwork(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(artwork));
    }

    /**
     * 作品を作成（JSON）
     * POST /api/artworks
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ArtworkResponse>> createArtwork(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ArtworkRequest request) {

        log.info("Create artwork request for: {}", userDetails.getUsername());

        ArtworkResponse artwork = artworkService.createArtwork(userDetails.getUsername(), request);
        return new ResponseEntity<>(
                ApiResponse.success("作品をアップロードしました", artwork),
                HttpStatus.CREATED);
    }

    /**
     * 画像ファイルをアップロードして作品を作成
     * POST /api/artworks/upload
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ArtworkResponse>> uploadArtwork(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) List<Long> tagIds) {

        log.info("Upload artwork request for: {}", userDetails.getUsername());

        ArtworkResponse artwork = artworkService.createArtworkWithUpload(
                userDetails.getUsername(), file, title, description, categoryId, tagIds);
        return new ResponseEntity<>(
                ApiResponse.success("作品をアップロードしました", artwork),
                HttpStatus.CREATED);
    }

    /**
     * 作品を更新
     * PUT /api/artworks/:id
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ArtworkResponse>> updateArtwork(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ArtworkRequest request) {

        log.info("Update artwork request: {} for: {}", id, userDetails.getUsername());

        ArtworkResponse artwork = artworkService.updateArtwork(
                userDetails.getUsername(), id, request);

        return ResponseEntity.ok(ApiResponse.success("作品を更新しました", artwork));
    }

    /**
     * 作品を削除
     * DELETE /api/artworks/:id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArtwork(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        log.info("Delete artwork request: {} for: {}", id, userDetails.getUsername());

        artworkService.deleteArtwork(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("作品を削除しました"));
    }

    /**
     * 作品の並び順を更新
     * PUT /api/artworks/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderArtworks(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ArtworkReorderRequest request) {

        log.info("Reorder artworks request for: {}", userDetails.getUsername());

        artworkService.reorderArtworks(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("並び順を更新しました"));
    }
}
