package com.picme.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 新規登録リクエストDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    @NotBlank(message = "ユーザー名は必須です")
    @Size(min = 3, max = 20, message = "ユーザー名は3〜20文字で入力してください")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "ユーザー名は半角英数字、ハイフン、アンダースコアのみ使用できます")
    private String username;

    @NotBlank(message = "メールアドレスは必須です")
    @Email(message = "有効なメールアドレスを入力してください")
    private String email;

    @NotBlank(message = "パスワードは必須です")
    @Size(min = 8, max = 100, message = "パスワードは8文字以上で入力してください")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).+$", message = "パスワードは英字と数字を含む必要があります")
    private String password;
}
