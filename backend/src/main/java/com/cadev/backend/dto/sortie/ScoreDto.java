package com.cadev.backend.dto.sortie;

import java.util.List;

public record ScoreDto(int score, String niveau, List<String> correspondantes,
                       List<String> aApprendre, List<String> manquantes) {}

