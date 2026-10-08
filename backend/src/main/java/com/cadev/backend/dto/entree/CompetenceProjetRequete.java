package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.Niveau;
import jakarta.validation.constraints.NotNull;

public record CompetenceProjetRequete(@NotNull Long competenceId, boolean obligatoire, Niveau niveauRequis) {}
