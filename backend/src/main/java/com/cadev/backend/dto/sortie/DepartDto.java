package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.DepartProjet;

import java.time.LocalDateTime;

public record DepartDto(Long utilisateurId, String prenom, String nom, String pseudo,
                        String motif, boolean retireParCreateur, LocalDateTime dateDepart) {

    public static DepartDto depuis(DepartProjet d) {
        UtilisateurResumeDto u = UtilisateurResumeDto.depuis(d.getUtilisateur());
        return new DepartDto(u.id(), u.prenom(), u.nom(), u.pseudo(),
                d.getMotif(), d.isRetireParCreateur(), d.getDateDepart());
    }
}
