package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.RoleMembre;
import com.cadev.backend.enumeration.StatutProjet;

import java.util.List;

public record MonProjetDto(
        Long id, String nom, String description, String categorie, String technologies,
        StatutProjet statut, int placesRestantes, boolean ouvertAuxDemandes, int nombreMembres,
        UtilisateurResumeDto createur, List<String> competencesRecherchees,
        RoleMembre roleMembre, int demandesEnAttente) {}
