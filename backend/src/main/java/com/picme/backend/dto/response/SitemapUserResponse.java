package com.picme.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SitemapUserResponse {
    private String username;
    private String updatedAt;
}
