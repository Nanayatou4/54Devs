package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReponseChallengeRequete(@NotBlank @Size(max = 500) String reponse) {}
