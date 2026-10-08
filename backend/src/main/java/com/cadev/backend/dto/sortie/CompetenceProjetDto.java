package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.Competence;
import com.cadev.backend.entite.CompetenceProjet;
import com.cadev.backend.enumeration.Niveau;

public record CompetenceProjetDto(Long competenceId, String nom, String categorie, boolean obligatoire, Niveau niveauRequis) {

    public static CompetenceProjetDto depuis(CompetenceProjet cp) {
        Competence c = cp.getCompetence();
        return new CompetenceProjetDto(c.getId(), c.getNom(), c.getCategorie(),
                cp.isObligatoire(), cp.getNiveauRequis());
    }
}
