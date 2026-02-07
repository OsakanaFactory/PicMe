package com.picme.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * プロフィールエンティティ
 * ユーザーの公開プロフィール情報を管理
 */
@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "display_name", length = 32)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "header_url", length = 500)
    private String headerUrl;

    @Column(length = 50)
    @Builder.Default
    private String theme = "LIGHT";

    @Column(name = "color_primary", length = 7)
    private String colorPrimary;

    @Column(name = "color_accent", length = 7)
    private String colorAccent;

    @Column(name = "font_family", length = 50)
    private String fontFamily;

    @Column(length = 20)
    @Builder.Default
    private String layout = "STANDARD";

    @Column(name = "custom_css", columnDefinition = "TEXT")
    private String customCss;

    @Column(name = "contact_form_enabled")
    @Builder.Default
    private Boolean contactFormEnabled = false;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
