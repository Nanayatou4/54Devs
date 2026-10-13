package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.Size;

public record TerminerRequete(@Size(max = 2000) String bilan) {
}
