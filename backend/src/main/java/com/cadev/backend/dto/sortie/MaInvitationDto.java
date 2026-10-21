package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutInvitation;

public record MaInvitationDto(Long id, StatutInvitation statut) {
}
