package com.cadev.backend.dto.sortie;

import java.util.List;

public record DashboardDto(
        UtilisateurResumeDto utilisateur,
        ProfilCompletDto profil,
        int demandesATraiter,
        List<MonProjetDto> mesProjets,
        List<DemandeDto> mesDemandesEnAttente,
        ChallengeDetailDto challengeDuJour,
        List<ProjetRecommandeDto> projetsRecommandes,
        List<CollaborateurRecommandeDto> collaborateursRecommandes,
        List<QuestionResumeDto> questionsPourMoi,
        EchangesDto echangesCompetences,
        BadgesResumeDto badges) {
}
