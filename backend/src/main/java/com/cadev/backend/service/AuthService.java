package com.cadev.backend.service;

import com.cadev.backend.dto.entree.ConnexionRequete;
import com.cadev.backend.dto.entree.InscriptionRequete;
import com.cadev.backend.dto.ReponseAuth;
import com.cadev.backend.dto.sortie.UtilisateurDto;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.exception.EmailDejaUtiliseException;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.securite.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurs;
    private final PasswordEncoder encodeur;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    @Transactional
    public ReponseAuth inscrire(InscriptionRequete req) {
        String email = req.email().trim().toLowerCase();
        if (utilisateurs.existsByEmail(email)) {
            throw new EmailDejaUtiliseException();
        }

        Utilisateur u = new Utilisateur();
        u.setNom(req.nom().trim());
        u.setPrenom(req.prenom().trim());
        u.setEmail(email);
        u.setMotDePasse(encodeur.encode(req.motDePasse()));

        Profil p = new Profil();
        p.setUtilisateur(u);
        p.setPseudo(u.getPrenom());
        p.setPays(req.pays());
        u.setProfil(p); // sauvegardé en cascade

        utilisateurs.save(u);
        return new ReponseAuth(jwtService.generateToken(email), UtilisateurDto.depuis(u));
    }

    public ReponseAuth connecter(ConnexionRequete req) {
        String email = req.email().trim().toLowerCase();
        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.motDePasse()));
        Utilisateur u = utilisateurs.findByEmail(email).orElseThrow();
        return new ReponseAuth(jwtService.generateToken(email), UtilisateurDto.depuis(u));
    }
}
