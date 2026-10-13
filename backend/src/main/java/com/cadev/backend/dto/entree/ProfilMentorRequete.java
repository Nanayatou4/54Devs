package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.*;

public record ProfilMentorRequete(
        @NotBlank @Size(max = 1000) String presentation,
        @NotNull @Min(1) @Max(10) Integer nombreMentoresMax,
        Boolean actif) {}

