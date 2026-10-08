package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.CompetenceUtilisateurDto;
import com.cadev.backend.dto.entree.CompetenceUtilisateurRequete;
import com.cadev.backend.dto.sortie.ProfilDto;
import com.cadev.backend.dto.entree.ProfilRequete;
import com.cadev.backend.service.ProfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
public class ProfilController {

    private final ProfilService profilService;

    @GetMapping("/moi")
    public ProfilDto monProfil(Authentication authentication) {
        return profilService.monProfil(authentication.getName());
    }

    @PutMapping("/moi")
    public ProfilDto modifierMonProfil(Authentication authentication,
                                       @Valid @RequestBody ProfilRequete requete) {
        return profilService.modifierMonProfil(authentication.getName(), requete);
    }

    @GetMapping("/moi/competences")
    public List<CompetenceUtilisateurDto> mesCompetences(Authentication authentication) {
        return profilService.mesCompetences(authentication.getName());
    }

    @PutMapping("/moi/competences")
    public List<CompetenceUtilisateurDto> remplacerMesCompetences(
            Authentication authentication,
            @RequestBody List<CompetenceUtilisateurRequete> demandes) {
        return profilService.remplacerMesCompetences(authentication.getName(), demandes);
    }
}


