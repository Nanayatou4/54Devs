package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Role;

import java.time.LocalDateTime;

public record AdminUtilisateurDto(Long id, String nom, String prenom, String email, String pseudo,
                                  String pays, Role role, boolean actif, LocalDateTime dateInscription) {
    public static AdminUtilisateurDto depuis(Utilisateur u) {
        Profil p = u.getProfil();
        return new AdminUtilisateurDto(u.getId(), u.getNom(), u.getPrenom(), u.getEmail(),
                p != null ? p.getPseudo() : u.getPrenom(), p != null ? p.getPays() : null,
                u.getRole(), u.isActif(), u.getDateInscription());
    }
}

