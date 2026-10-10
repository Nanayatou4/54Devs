package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.BadgeUtilisateur;

import java.time.LocalDateTime;

public record BadgeObtenuDto(String code, String nom, String description, LocalDateTime dateObtention) {

    public static BadgeObtenuDto depuis(BadgeUtilisateur bu) {
        return new BadgeObtenuDto(bu.getBadge().getCode(), bu.getBadge().getNom(),
                bu.getBadge().getDescription(), bu.getDateObtention());
    }
}