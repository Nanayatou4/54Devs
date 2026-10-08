package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutDemande;

import java.time.LocalDateTime;
import java.util.List;

public record DemandeRecueDto(Long id, String message, StatutDemande statut, LocalDateTime dateDemande,
                              UtilisateurResumeDto demandeur,
                              List<CompetenceUtilisateurDto> competences) {}
