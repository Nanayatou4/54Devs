package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.ChallengeRequete;
import com.cadev.backend.dto.entree.ReponseChallengeRequete;
import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;
import com.cadev.backend.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService service;

    @GetMapping
    public PageDto<ChallengeResumeDto> lister(
            Authentication auth,
            @RequestParam(required = false) TypeChallenge type,
            @RequestParam(required = false) DifficulteChallenge difficulte,
            @RequestParam(required = false) Boolean ouvert,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int taille) {
        return service.lister(auth.getName(), type, difficulte, ouvert, page, taille);
    }

    @GetMapping("/du-jour")
    public ChallengeDetailDto duJour(Authentication auth) {
        return service.duJour(auth.getName());
    }

    @GetMapping("/classement")
    public ClassementDto classement(Authentication auth,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int taille) {
        return service.classement(auth.getName(), page, taille);
    }

    @GetMapping("/{id}")
    public ChallengeDetailDto detail(Authentication auth, @PathVariable Long id) {
        return service.detail(id, auth.getName());
    }

    @PostMapping("/{id}/reponses")
    public ResultatChallengeDto repondre(Authentication auth, @PathVariable Long id,
                                         @Valid @RequestBody ReponseChallengeRequete requete) {
        return service.repondre(id, auth.getName(), requete);
    }
}


