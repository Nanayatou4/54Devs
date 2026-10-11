package com.cadev.backend.dto.sortie;

import java.util.List;

public record EchangesDto(int total, List<EchangeCompetencesDto> exemples) {
}
