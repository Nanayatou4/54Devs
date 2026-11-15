package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.Competition;
import com.cadev.backend.enumeration.TypeCompetition;

import java.time.LocalDateTime;

public record CompetitionDto(
        Long id,
        String titre,
        String description,
        String theme,
        TypeCompetition type,
        LocalDateTime dateDebut,
        LocalDateTime dateFin,
        int pointsMaximum,
        String statut,
        boolean dejaSoumis,
        Integer monScore
) {
    public static CompetitionDto depuis(Competition c, boolean dejaSoumis, Integer monScore, String statut) {
        return new CompetitionDto(c.getId(), c.getTitre(), c.getDescription(), c.getTheme(),
                c.getType(), c.getDateDebut(), c.getDateFin(), c.getPointsMaximum(),
                statut, dejaSoumis, monScore);
    }
}
