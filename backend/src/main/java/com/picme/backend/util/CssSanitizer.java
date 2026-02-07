package com.picme.backend.util;

import java.util.regex.Pattern;

/**
 * CSSサニタイザー
 * XSS防止のためにCSSを検証・サニタイズ
 */
public class CssSanitizer {

    // 危険なCSS関数・ディレクティブ
    private static final Pattern DANGEROUS_PATTERNS = Pattern.compile(
            "(?i)(@import|url\\s*\\(|expression\\s*\\(|javascript:|behavior:|" +
            "-moz-binding|eval\\s*\\(|document\\.|window\\.|" +
            "\\\\[0-9a-f]|data:)",
            Pattern.CASE_INSENSITIVE
    );

    private CssSanitizer() {}

    /**
     * CSSをサニタイズ
     * 危険なパターンを除去して安全なCSSを返す
     */
    public static String sanitize(String css) {
        if (css == null || css.isBlank()) {
            return "";
        }

        // 行ごとに処理し、危険な行を除去
        StringBuilder sanitized = new StringBuilder();
        for (String line : css.split("\n")) {
            String trimmed = line.trim();
            if (!DANGEROUS_PATTERNS.matcher(trimmed).find()) {
                sanitized.append(line).append("\n");
            }
        }

        return sanitized.toString().trim();
    }

    /**
     * CSSが有効かチェック（行数制限）
     */
    public static String validate(String css, int maxLines) {
        if (css == null || css.isBlank()) {
            return null;
        }

        long lineCount = css.lines().count();
        if (lineCount > maxLines) {
            return "CSSは" + maxLines + "行以内にしてください（現在: " + lineCount + "行）";
        }

        if (DANGEROUS_PATTERNS.matcher(css).find()) {
            return "使用できないCSS構文が含まれています（@import, url(), expression()等は使用できません）";
        }

        return null; // バリデーション成功
    }
}
