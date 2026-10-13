package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.StatutMentorat;
import jakarta.validation.constraints.NotNull;

public record DecisionMentoratRequete(@NotNull StatutMentorat decision) {
}
