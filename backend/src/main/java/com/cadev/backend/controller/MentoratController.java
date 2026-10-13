package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.*;
import com.cadev.backend.dto.sortie.MentoratDetailDto;
import com.cadev.backend.dto.sortie.MentoratDto;
import com.cadev.backend.dto.sortie.MesMentoratsDto;
import com.cadev.backend.dto.sortie.SeanceDto;
import com.cadev.backend.service.MentoratService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentorats")
@RequiredArgsConstructor
public class MentoratController {

    private final MentoratService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MentoratDto demander(Authentication auth, @Valid @RequestBody DemandeMentoratRequete requete) {
        return service.demander(auth.getName(), requete);
    }

    @GetMapping("/mes-mentorats")
    public MesMentoratsDto mesMentorats(Authentication auth) {
        return service.mesMentorats(auth.getName());
    }

    @GetMapping("/{id}")
    public MentoratDetailDto detail(Authentication auth, @PathVariable Long id) {
        return service.detail(id, auth.getName());
    }

    @PatchMapping("/{id}")
    public MentoratDto decider(Authentication auth, @PathVariable Long id,
                               @Valid @RequestBody DecisionMentoratRequete requete) {
        return service.decider(id, auth.getName(), requete.decision());
    }

    @PostMapping("/{id}/seances")
    @ResponseStatus(HttpStatus.CREATED)
    public SeanceDto planifier(Authentication auth, @PathVariable Long id, @Valid @RequestBody SeanceRequete requete) {
        return service.planifier(id, auth.getName(), requete);
    }

    @PutMapping("/{id}/seances/{seanceId}/compte-rendu")
    public SeanceDto compteRendu(Authentication auth, @PathVariable Long id, @PathVariable Long seanceId,
                                 @Valid @RequestBody CompteRenduRequete requete) {
        return service.compteRendu(id, seanceId, auth.getName(), requete);
    }

    @PatchMapping("/{id}/terminer")
    public MentoratDto terminer(Authentication auth, @PathVariable Long id,
                                @Valid @RequestBody(required = false) TerminerRequete requete) {
        return service.terminer(id, auth.getName(), requete);
    }

    @PutMapping("/{id}/bilan")
    public MentoratDto bilan(Authentication auth, @PathVariable Long id, @Valid @RequestBody BilanRequete requete) {
        return service.bilan(id, auth.getName(), requete);
    }
}
