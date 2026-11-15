package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.SoumissionCompetitionRequete;
import com.cadev.backend.dto.sortie.CompetitionDto;
import com.cadev.backend.dto.sortie.SoumissionCompetitionDto;
import com.cadev.backend.service.CompetitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competitions")
@RequiredArgsConstructor
public class CompetitionController {
    private final CompetitionService service;

    @GetMapping
    public List<CompetitionDto> lister(Authentication auth) {
        return service.lister(auth.getName());
    }

    @PostMapping("/{id}/soumissions")
    @ResponseStatus(HttpStatus.CREATED)
    public CompetitionDto soumettre(Authentication auth, @PathVariable Long id,
            @Valid @RequestBody SoumissionCompetitionRequete requete) {
        return service.soumettre(id, auth.getName(), requete);
    }

    @GetMapping("/{id}/classement")
    public List<SoumissionCompetitionDto> classement(@PathVariable Long id) {
        return service.classement(id);
    }
}
