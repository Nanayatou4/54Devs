package com.cadev.backend.dto;

import com.cadev.backend.enumeration.StatutProjet;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record ProjetRequete(
        @NotBlank @Size(min = 3, max = 100) String nom,
        @NotBlank @Size(max = 2000) String description,
        @Size(max = 1000) String probleme,
        @Size(max = 1000) String solution,
        @Size(max = 100) String categorie,
        @Size(max = 255) String technologies,
        @NotNull StatutProjet statut,
        @NotNull @Min(1) @Max(20) Integer nombrePlacesRecherchees,
        @Size(max = 500) String rolesRecherches,
        @Size(max = 15) List<@Valid CompetenceProjetRequete> competencesRecherchees
) {
}
