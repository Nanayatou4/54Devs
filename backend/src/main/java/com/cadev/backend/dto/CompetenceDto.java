package com.cadev.backend.dto;

import com.cadev.backend.entite.Competence;

public record CompetenceDto(Long id, String nom, String categorie) {

    public static CompetenceDto depuis(Competence c) {
        return new CompetenceDto(c.getId(), c.getNom(), c.getCategorie());
    }
}