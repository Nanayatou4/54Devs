package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.ProfilMentorRequete;
import com.cadev.backend.dto.sortie.MentorDetailDto;
import com.cadev.backend.dto.sortie.MentorResumeDto;
import com.cadev.backend.dto.sortie.MonProfilMentorDto;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.service.MentorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService service;

    @GetMapping("/moi")
    public MonProfilMentorDto monProfil(Authentication auth) {
        return service.monProfil(auth.getName());
    }

    @PutMapping("/moi")
    public MonProfilMentorDto enregistrer(Authentication auth, @Valid @RequestBody ProfilMentorRequete requete) {
        return service.enregistrerProfil(auth.getName(), requete);
    }

    @GetMapping
    public PageDto<MentorResumeDto> rechercher(
            Authentication auth,
            @RequestParam(required = false) String texte,
            @RequestParam(required = false) Long competenceId,
            @RequestParam(required = false) String pays,
            @RequestParam(required = false) Niveau niveau,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int taille) {
        String email = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()))
                ? auth.getName() : null;
        return service.rechercher(email, texte, competenceId, pays, niveau, page, taille);
    }

    @GetMapping("/{utilisateurId}")
    public MentorDetailDto detail(@PathVariable Long utilisateurId) {
        return service.detail(utilisateurId);
    }
}
