package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record EvaluationCompetitionRequete(
        @Min(0) @Max(1000) int score,
        @Size(max = 2000) String retourEvaluation
) {}
