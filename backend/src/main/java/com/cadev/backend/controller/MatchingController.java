package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.DeveloppeurRecommandeDto;
import com.cadev.backend.dto.sortie.EchangeCompetencesDto;
import com.cadev.backend.dto.sortie.ProjetRecommandeDto;
import com.cadev.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService service;

    @GetMapping("/projets/recommandes")
    public List<ProjetRecommandeDto> projetsRecommandes(Authentication auth,
                                                        @RequestParam(defaultValue = "10") int limite) {
        return service.projetsRecommandes(auth.getName(), borne(limite));
    }

    @GetMapping("/projets/{id}/developpeurs-recommandes")
    public List<DeveloppeurRecommandeDto> developpeursRecommandes(Authentication auth, @PathVariable Long id,
                                                                  @RequestParam(defaultValue = "10") int limite) {
        return service.developpeursPourProjet(id, auth.getName(), borne(limite));
    }

    @GetMapping("/echanges-competences")
    public List<EchangeCompetencesDto> echanges(Authentication auth,
                                                @RequestParam(defaultValue = "10") int limite) {
        return service.echanges(auth.getName(), borne(limite));
    }

    private static int borne(int limite) {
        return Math.min(Math.max(limite, 1), 20);
    }
}
