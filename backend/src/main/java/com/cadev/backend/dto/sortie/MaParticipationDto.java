package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutParticipation;

public record MaParticipationDto(StatutParticipation statut, int nombreEssais, int essaisRestants,
                                 int score, String derniereReponse) {}

