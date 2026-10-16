package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.Niveau;

import java.util.List;

public record DeveloppeurDetailDto(Long utilisateurId, String prenom, String nom, String pseudo,
                                   String pays, String ville, Niveau niveau, String disponibilite, String bio,
                                   String github, String linkedin, String portfolio,
                                   List<CompetenceUtilisateurDto> competences,
                                   List<ProjetDeDeveloppeurDto> projets,
                                   List<BadgeObtenuDto> badges,
                                   String avatarUrl) {}
