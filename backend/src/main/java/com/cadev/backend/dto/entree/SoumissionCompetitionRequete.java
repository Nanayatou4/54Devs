package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SoumissionCompetitionRequete(
        @NotBlank @Size(max = 500) String urlDepot,
        @NotBlank @Size(max = 3000) String description
) {}
