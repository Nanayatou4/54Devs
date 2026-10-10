package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReponseRequete(@NotBlank @Size(max = 5000) String contenu) {}

