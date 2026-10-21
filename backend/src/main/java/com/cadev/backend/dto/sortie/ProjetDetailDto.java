package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutProjet;

import java.time.LocalDateTime;
import java.util.List;

public record ProjetDetailDto(
        Long id, String nom, String description, String probleme, String solution,
        String categorie, String technologies, String imageUrl, StatutProjet statut,
        int nombrePlacesRecherchees, int placesRestantes, boolean ouvertAuxDemandes,
        String rolesRecherches,String conditionsEngagement, LocalDateTime dateCreation,
        UtilisateurResumeDto createur,
        List<CompetenceProjetDto> competencesRecherchees,
        List<MembreDto> membres,
        boolean estCreateur, boolean estMembre,
        MaDemandeDto maDemande,
        MaInvitationDto maInvitation
) {}
