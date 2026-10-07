package com.cadev.backend.dto;

import com.cadev.backend.enumeration.StatutProjet;

import java.time.LocalDateTime;
import java.util.List;

public record ProjetDetailDto(
        Long id, String nom, String description, String probleme, String solution,
        String categorie, String technologies, StatutProjet statut,
        int nombrePlacesRecherchees, int placesRestantes, boolean ouvertAuxDemandes,
        String rolesRecherches, LocalDateTime dateCreation,
        UtilisateurResumeDto createur,
        List<CompetenceProjetDto> competencesRecherchees,
        List<MembreDto> membres,
        boolean estCreateur, boolean estMembre,
        MaDemandeDto maDemande
) {}
