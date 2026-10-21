package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutInvitation;

import java.time.LocalDateTime;

public record InvitationRecueDto(Long id, Long projetId, String projetNom, String conditionsEngagement,
                                 int placesRestantes, boolean ouvertAuxDemandes, UtilisateurResumeDto invitePar,
                                 String message, StatutInvitation statut, LocalDateTime dateInvitation) {
}
