package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutDemande;

public record MaDemandeDto(Long id, StatutDemande statut) {}
