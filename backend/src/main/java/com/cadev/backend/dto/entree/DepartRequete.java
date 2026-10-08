package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartRequete(@NotBlank @Size(max = 500) String motif) {}

