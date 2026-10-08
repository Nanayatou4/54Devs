package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.StatutDemande;
import jakarta.validation.constraints.NotNull;

public record DecisionRequete(@NotNull StatutDemande decision) {}

