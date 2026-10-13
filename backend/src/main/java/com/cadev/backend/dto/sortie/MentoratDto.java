package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutMentorat;

import java.time.LocalDateTime;

public record MentoratDto(Long id, UtilisateurResumeDto mentor, UtilisateurResumeDto mentore,
                          String sujet, String message, StatutMentorat statut,
                          LocalDateTime dateDemande, LocalDateTime dateDebut, LocalDateTime dateFin,
                          int seancesRealisees, int seancesPlanifiees) {
}
