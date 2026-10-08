package com.cadev.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleCodeRequete(@NotBlank String code) {
}
