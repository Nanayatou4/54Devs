package com.cadev.backend.dto;

import com.cadev.backend.entite.Competence;
import com.cadev.backend.entite.CompetenceUtilisateur;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.TypeCompetence;

public record CompetenceUtilisateurDto (Long competenceId, String nom, String categorie, TypeCompetence type, Niveau niveau) {

    public static CompetenceUtilisateurDto depuis(CompetenceUtilisateur cu) {
        Competence c = cu.getCompetence();
        return new CompetenceUtilisateurDto(c.getId(), c.getNom(), c.getCategorie(), cu.getType(), cu.getNiveau());
    }
}