package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompteRenduRequete(@NotBlank @Size(max = 3000) String compteRendu) {
}
