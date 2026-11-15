package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.CompetitionRequete;
import com.cadev.backend.dto.entree.EvaluationCompetitionRequete;
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
@RequestMapping("/api/admin/competitions")
@RequiredArgsConstructor
public class AdminCompetitionController {
    private final CompetitionService service;

    @GetMapping
    public List<CompetitionDto> lister() {
        return service.listerAdmin();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CompetitionDto creer(Authentication auth, @Valid @RequestBody CompetitionRequete requete) {
        return service.creer(auth.getName(), requete);
    }

    @GetMapping("/{id}/soumissions")
    public List<SoumissionCompetitionDto> soumissions(@PathVariable Long id) {
        return service.soumissionsAdmin(id);
    }

    @PutMapping("/{competitionId}/soumissions/{soumissionId}/evaluation")
    public SoumissionCompetitionDto evaluer(@PathVariable Long competitionId,
            @PathVariable Long soumissionId,
            @Valid @RequestBody EvaluationCompetitionRequete requete) {
        return service.evaluer(competitionId, soumissionId, requete);
    }
}
