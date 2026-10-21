package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.InvitationProjet;
import com.cadev.backend.enumeration.StatutInvitation;

import java.time.LocalDateTime;

public record InvitationEnvoyeeDto(Long id, UtilisateurResumeDto invite, String message, StatutInvitation statut,
                                   LocalDateTime dateInvitation, LocalDateTime dateReponse) {
    public static InvitationEnvoyeeDto depuis(InvitationProjet i) {
        return new InvitationEnvoyeeDto(i.getId(), UtilisateurResumeDto.depuis(i.getInvite()), i.getMessage(),
                i.getStatut(), i.getDateInvitation(), i.getDateReponse());
    }
}
