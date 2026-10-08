package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.Size;

public record DemandeRequete(@Size(max = 500) String message,Boolean engagementAccepte) {}

