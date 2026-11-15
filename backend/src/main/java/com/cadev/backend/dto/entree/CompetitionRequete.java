package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.TypeCompetition;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CompetitionRequete(
        @NotBlank @Size(min = 5, max = 150) String titre,
        @NotBlank @Size(max = 5000) String description,
        @NotBlank @Size(max = 80) String theme,
        @NotNull TypeCompetition type,
        @NotNull LocalDateTime dateDebut,
        @NotNull LocalDateTime dateFin,
        @Min(1) @Max(1000) int pointsMaximum
) {}
