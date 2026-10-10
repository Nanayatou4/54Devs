package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutParticipation;

public record ResultatChallengeDto(boolean correct, StatutParticipation statut, int essaisRestants,
                                   int score, String explication) {}
