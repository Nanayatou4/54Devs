package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.DecisionInvitationRequete;
import com.cadev.backend.dto.entree.InvitationRequete;
import com.cadev.backend.dto.sortie.InvitationEnvoyeeDto;
import com.cadev.backend.dto.sortie.InvitationRecueDto;
import com.cadev.backend.enumeration.StatutInvitation;
import com.cadev.backend.service.InvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService service;

    @PostMapping("/projets/{id}/invitations")
    @ResponseStatus(HttpStatus.CREATED)
    public InvitationEnvoyeeDto inviter(Authentication auth, @PathVariable Long id,
                                        @Valid @RequestBody InvitationRequete requete) {
        return service.inviter(id, auth.getName(), requete);
    }

    @GetMapping("/projets/{id}/invitations")
    public List<InvitationEnvoyeeDto> envoyees(Authentication auth, @PathVariable Long id,
                                               @RequestParam(required = false) StatutInvitation statut) {
        return service.envoyees(id, auth.getName(), statut);
    }

    @DeleteMapping("/projets/{id}/invitations/{invitationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void annuler(Authentication auth, @PathVariable Long id, @PathVariable Long invitationId) {
        service.annuler(id, invitationId, auth.getName());
    }

    @GetMapping("/invitations/mes-invitations")
    public List<InvitationRecueDto> mesInvitations(Authentication auth,
                                                   @RequestParam(required = false) StatutInvitation statut) {
        return service.mesInvitations(auth.getName(), statut);
    }

    @PatchMapping("/invitations/{id}")
    public InvitationRecueDto repondre(Authentication auth, @PathVariable Long id,
                                       @Valid @RequestBody DecisionInvitationRequete requete) {
        return service.repondre(id, auth.getName(), requete);
    }
}