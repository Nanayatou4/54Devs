package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.DemandeAdhesion;
import com.cadev.backend.enumeration.StatutDemande;

import java.time.LocalDateTime;

public record DemandeDto(Long id, Long projetId, String projetNom, String message,
                         StatutDemande statut, LocalDateTime dateDemande) {

    public static DemandeDto depuis(DemandeAdhesion d) {
        return new DemandeDto(d.getId(), d.getProjet().getId(), d.getProjet().getNom(),
                d.getMessage(), d.getStatut(), d.getDateDemande());
    }
}
