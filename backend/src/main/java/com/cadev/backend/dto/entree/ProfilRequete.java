package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.Niveau;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfilRequete(
        @NotBlank @Size(max = 50) String pseudo,
        @Size(max = 1000) String bio,
        @Size(max = 100) String pays,
        @Size(max = 100) String ville,
        Niveau niveau,
        @Size(max = 255) String disponibilite,
        @Size(max = 255) String github,
        @Size(max = 255) String linkedin,
        @Size(max = 255) String portfolio,
        @Size(max = 60000) String avatarUrl) {}

