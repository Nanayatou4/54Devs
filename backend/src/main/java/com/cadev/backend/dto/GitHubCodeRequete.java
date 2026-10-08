package com.cadev.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record GitHubCodeRequete(@NotBlank String code) {
}
