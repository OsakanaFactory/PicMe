package com.picme.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * ページビューエンティティ
 * 公開ページへのアクセスを記録
 */
@Entity
@Table(name = "page_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "visitor_ip", length = 45)
    private String visitorIp;

    @Column(length = 500)
    private String referrer;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "viewed_at")
    @Builder.Default
    private LocalDateTime viewedAt = LocalDateTime.now();
}
