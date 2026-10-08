package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ConnexionRequete(
        @Email @NotBlank String email,
        @NotBlank String motDePasse
) {
}
