package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.StatutInvitation;
import jakarta.validation.constraints.NotNull;

public record DecisionInvitationRequete(@NotNull StatutInvitation decision, Boolean engagementAccepte) {
}
