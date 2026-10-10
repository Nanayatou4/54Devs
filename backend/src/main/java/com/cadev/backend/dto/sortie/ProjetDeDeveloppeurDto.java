package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.RoleMembre;
import com.cadev.backend.enumeration.StatutProjet;

public record ProjetDeDeveloppeurDto(Long id, String nom, StatutProjet statut, RoleMembre roleMembre) {}

