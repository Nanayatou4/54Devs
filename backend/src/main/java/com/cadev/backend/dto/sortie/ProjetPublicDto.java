package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutProjet;

import java.util.List;

public record ProjetPublicDto(Long id, String nom, String extrait, String categorie, String technologies,
                              String imageUrl,
                              StatutProjet statut, int placesRestantes, int nombreMembres,
                              List<String> competencesRecherchees, String createurPseudo, String createurPays) {}
