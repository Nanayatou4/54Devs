package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DiscussionRequete(@NotBlank @Size(max = 1000) String contenu) {}

