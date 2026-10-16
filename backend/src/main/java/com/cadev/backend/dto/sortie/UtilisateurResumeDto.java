package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Niveau;

public record UtilisateurResumeDto(Long id, String nom, String prenom, String pseudo, String pays, Niveau niveau, String avatarUrl) {

    public static UtilisateurResumeDto depuis(Utilisateur u) {
        Profil p = u.getProfil();
        return new UtilisateurResumeDto(u.getId(), u.getNom(), u.getPrenom(),
                p != null ? p.getPseudo() : u.getPrenom(),
                p != null ? p.getPays() : null,
                p != null ? p.getNiveau() : null,
                p != null ? p.getAvatarUrl() : null);
    }
}
