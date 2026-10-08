package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Role;

public record UtilisateurDto(Long id, String nom, String prenom, String email, Role role) {
    public static UtilisateurDto depuis(Utilisateur u) {
        return new UtilisateurDto(u.getId(), u.getNom(), u.getPrenom(), u.getEmail(), u.getRole());
    }
}
