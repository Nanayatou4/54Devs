package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.Profil;
import com.cadev.backend.enumeration.Niveau;

public record ProfilDto(Long id, String pseudo, String bio, String pays, String ville, Niveau niveau,
                        String disponibilite, String github, String linkedin, String portfolio, String avatarUrl) {

    public static ProfilDto depuis(Profil p) {
        return new ProfilDto(p.getId(), p.getPseudo(), p.getBio(), p.getPays(), p.getVille(),
                p.getNiveau(), p.getDisponibilite(), p.getGithub(), p.getLinkedin(), p.getPortfolio(), p.getAvatarUrl());
    }
}
