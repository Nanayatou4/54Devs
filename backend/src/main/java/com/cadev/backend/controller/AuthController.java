package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.ConnexionRequete;
import com.cadev.backend.dto.entree.InscriptionRequete;
import com.cadev.backend.dto.ReponseAuth;
import com.cadev.backend.dto.sortie.UtilisateurDto;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UtilisateurRepository utilisateurs;

    @PostMapping("/inscription")
    public ResponseEntity<ReponseAuth> inscription(@Valid @RequestBody InscriptionRequete req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.inscrire(req));
    }

    @PostMapping("/connexion")
    public ReponseAuth connexion(@Valid @RequestBody ConnexionRequete req) {
        return authService.connecter(req);
    }

    @GetMapping("/moi")
    public UtilisateurDto moi(Authentication authentication) {
        return UtilisateurDto.depuis(utilisateurs.findByEmail(authentication.getName()).orElseThrow());
    }
}
