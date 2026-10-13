package com.cadev.backend.dto.entree;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record SeanceRequete(@NotNull LocalDateTime date,
                            @NotNull @Min(15) @Max(240) Integer dureeMinutes,
                            @Size(max = 200) String sujet) {
}
