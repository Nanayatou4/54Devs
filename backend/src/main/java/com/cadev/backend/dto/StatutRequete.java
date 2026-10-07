package com.cadev.backend.dto;

import com.cadev.backend.enumeration.StatutProjet;
import jakarta.validation.constraints.NotNull;

public record StatutRequete(@NotNull StatutProjet statut) {}
