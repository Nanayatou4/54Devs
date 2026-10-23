package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.DeveloppeurDetailDto;
import com.cadev.backend.dto.sortie.DeveloppeurResumeDto;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.TypeCompetence;
import com.cadev.backend.service.DeveloppeurService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/developpeurs")
@RequiredArgsConstructor
public class DeveloppeurController {

    private final DeveloppeurService service;

    @GetMapping
    public PageDto<DeveloppeurResumeDto> rechercher(
            Authentication auth,
            @RequestParam(required = false) String texte,
            @RequestParam(required = false) Long competenceId,
            @RequestParam(required = false) TypeCompetence type,
            @RequestParam(required = false) String pays,
            @RequestParam(required = false) Niveau niveau,
            @RequestParam(required = false) String disponibilite,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int taille) {
        String email = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()))
                ? auth.getName() : null;
        return service.rechercher(email, texte, competenceId, type, pays, niveau, disponibilite, page, taille);
    }

    @GetMapping("/{utilisateurId}")
    public DeveloppeurDetailDto detail(@PathVariable Long utilisateurId) {
        return service.detail(utilisateurId);
    }
}
