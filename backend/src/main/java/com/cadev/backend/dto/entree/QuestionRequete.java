package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record QuestionRequete(@NotBlank @Size(min = 5, max = 150) String titre,
                              @NotBlank @Size(min = 10, max = 5000) String contenu,
                              @Size(max = 100) String categorie) {}

