package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BilanRequete(@NotBlank @Size(max = 2000) String bilan) {
}
