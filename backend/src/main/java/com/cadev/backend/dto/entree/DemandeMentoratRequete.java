package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DemandeMentoratRequete(@NotNull Long mentorId, @Size(max = 200) String sujet,
                                     @Size(max = 500) String message) {
}
