package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.MembreProjet;
import com.cadev.backend.enumeration.RoleMembre;

import java.time.LocalDateTime;

public record MembreDto(Long utilisateurId, String nom, String prenom, String pseudo, String pays,
                        RoleMembre roleMembre, LocalDateTime dateAdhesion, String avatarUrl) {

    public static MembreDto depuis(MembreProjet m) {
        UtilisateurResumeDto u = UtilisateurResumeDto.depuis(m.getUtilisateur());
        return new MembreDto(u.id(), u.nom(), u.prenom(), u.pseudo(), u.pays(),
                m.getRole(), m.getDateAdhesion(), u.avatarUrl());
    }
}
