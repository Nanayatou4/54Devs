package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.DemandeDto;
import com.cadev.backend.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
public class DemandeController {

    private final DemandeService demandeService;

    @GetMapping("/mes-demandes")
    public List<DemandeDto> mesDemandes(Authentication auth) {
        return demandeService.mesDemandes(auth.getName());
    }
}