package com.cadev.backend.dto.sortie;

import java.time.LocalDateTime;

public record BadgeDto(String code, String nom, String description, boolean obtenu,
                       LocalDateTime dateObtention, ProgressionDto progression) {}
