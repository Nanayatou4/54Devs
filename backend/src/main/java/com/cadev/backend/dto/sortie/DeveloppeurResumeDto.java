package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.Niveau;

import java.util.List;

public record DeveloppeurResumeDto(Long utilisateurId, String prenom, String nom, String pseudo,
                                   String pays, String ville, Niveau niveau, String disponibilite, String bio,
                                   List<String> competencesMaitrisees,
                                   List<String> competencesAEnseigner,
                                   List<String> competencesAApprendre) {}