package com.cadev.backend.controller;

import com.cadev.backend.dto.ConnexionRequete;
import com.cadev.backend.dto.GitHubCodeRequete;
import com.cadev.backend.dto.GoogleCodeRequete;
import com.cadev.backend.dto.InscriptionRequete;
import com.cadev.backend.dto.ReponseAuth;
import com.cadev.backend.dto.UtilisateurDto;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.AuthService;
import com.cadev.backend.service.GitHubOAuthService;
import com.cadev.backend.service.GoogleOAuthService;
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
    private final GitHubOAuthService gitHubOAuthService;
    private final GoogleOAuthService googleOAuthService;
    private final UtilisateurRepository utilisateurs;

    @PostMapping("/inscription")
    public ResponseEntity<ReponseAuth> inscription(@Valid @RequestBody InscriptionRequete req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.inscrire(req));
    }

    @PostMapping("/connexion")
    public ReponseAuth connexion(@Valid @RequestBody ConnexionRequete req) {
        return authService.connecter(req);
    }

    @PostMapping("/github")
    public ResponseEntity<?> github(@Valid @RequestBody GitHubCodeRequete req) {
        try {
            return ResponseEntity.ok(gitHubOAuthService.authentifierAvecGitHub(req.code()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> google(@Valid @RequestBody GoogleCodeRequete req) {
        try {
            return ResponseEntity.ok(googleOAuthService.authentifierAvecGoogle(req.code()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/moi")
    public UtilisateurDto moi(Authentication authentication) {
        return UtilisateurDto.depuis(utilisateurs.findByEmail(authentication.getName()).orElseThrow());
    }
}
