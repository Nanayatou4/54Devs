package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.SeanceMentorat;
import com.cadev.backend.enumeration.StatutSeance;

import java.time.LocalDateTime;

public record SeanceDto(Long id, LocalDateTime date, int dureeMinutes, String sujet,
                        StatutSeance statut, String compteRendu) {
    public static SeanceDto depuis(SeanceMentorat s) {
        return new SeanceDto(s.getId(), s.getDate(), s.getDureeMinutes(), s.getSujet(),
                s.getStatut(), s.getCompteRendu());
    }
}
