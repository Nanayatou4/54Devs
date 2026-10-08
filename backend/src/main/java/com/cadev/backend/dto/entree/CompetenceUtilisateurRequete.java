package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.TypeCompetence;

public record CompetenceUtilisateurRequete(Long competenceId, TypeCompetence type, Niveau niveau) {
}
