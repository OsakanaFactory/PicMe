package com.picme.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicInquiryRequest {

    @NotBlank(message = "お名前は必須です")
    @Size(max = 100, message = "お名前は100文字以内で入力してください")
    private String name;

    @NotBlank(message = "メールアドレスは必須です")
    @Email(message = "有効なメールアドレスを入力してください")
    private String email;

    @NotBlank(message = "件名は必須です")
    @Size(max = 200, message = "件名は200文字以内で入力してください")
    private String subject;

    @NotBlank(message = "メッセージは必須です")
    @Size(max = 2000, message = "メッセージは2000文字以内で入力してください")
    private String message;
}
