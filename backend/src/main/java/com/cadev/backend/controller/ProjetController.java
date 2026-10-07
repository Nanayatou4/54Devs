package com.cadev.backend.controller;

import com.cadev.backend.dto.ProjetDetailDto;
import com.cadev.backend.dto.ProjetRequete;
import com.cadev.backend.dto.StatutRequete;
import com.cadev.backend.service.ProjetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
public class ProjetController {

    private final ProjetService projetService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjetDetailDto creer(Authentication authentication, @Valid @RequestBody ProjetRequete requete) {
        return projetService.creer(authentication.getName(), requete);
    }

    @GetMapping("/{id}")
    public ProjetDetailDto detail(Authentication authentication, @PathVariable Long id) {
        return projetService.detail(id, authentication.getName());
    }

    @PutMapping("/{id}")
    public ProjetDetailDto modifier(Authentication authentication, @PathVariable Long id,
                                    @Valid @RequestBody ProjetRequete requete) {
        return projetService.modifier(id, authentication.getName(), requete);
    }

    @PatchMapping("/{id}/statut")
    public ProjetDetailDto changerStatut(Authentication authentication, @PathVariable Long id,
                                         @Valid @RequestBody StatutRequete requete) {
        return projetService.changerStatut(id, authentication.getName(), requete.statut());
    }
}
