package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InvitationRequete(@NotNull Long utilisateurId, @Size(max = 500) String message) {}

