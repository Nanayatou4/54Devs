package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.CompetitionRequete;
import com.cadev.backend.dto.sortie.CompetitionDto;
import com.cadev.backend.service.CompetitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/competitions")
@RequiredArgsConstructor
public class AdminCompetitionController {

    private final CompetitionService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CompetitionDto creer(Authentication auth, @Valid @RequestBody CompetitionRequete requete) {
        return service.creer(auth.getName(), requete);
    }
}
