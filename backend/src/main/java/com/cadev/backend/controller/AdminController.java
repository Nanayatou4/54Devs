package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.ActifRequete;
import com.cadev.backend.dto.sortie.AdminStatistiquesDto;
import com.cadev.backend.dto.sortie.AdminUtilisateurDto;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.enumeration.Role;
import com.cadev.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;

    @GetMapping("/statistiques")
    public AdminStatistiquesDto statistiques() {
        return service.statistiques();
    }

    @GetMapping("/utilisateurs")
    public PageDto<AdminUtilisateurDto> utilisateurs(
            @RequestParam(required = false) String texte,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean actif,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int taille) {
        return service.utilisateurs(texte, role, actif, page, taille);
    }

    @PatchMapping("/utilisateurs/{id}")
    public AdminUtilisateurDto changerActif(Authentication auth, @PathVariable Long id,
                                            @Valid @RequestBody ActifRequete requete) {
        return service.changerActif(id, requete.actif(), auth.getName());
    }

    @DeleteMapping("/questions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerQuestion(@PathVariable Long id) {
        service.supprimerQuestion(id);
    }

    @DeleteMapping("/questions/{questionId}/reponses/{reponseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerReponse(@PathVariable Long questionId, @PathVariable Long reponseId) {
        service.supprimerReponse(questionId, reponseId);
    }
}