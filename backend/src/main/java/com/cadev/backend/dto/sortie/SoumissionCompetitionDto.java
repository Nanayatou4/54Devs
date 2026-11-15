package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.SoumissionCompetition;
import java.time.LocalDateTime;

public record SoumissionCompetitionDto(Long id, Long utilisateurId, String pseudo, String nom,
        String prenom, String urlDepot, String description, LocalDateTime dateSoumission,
        int score, boolean evaluee, String retourEvaluation) {
    public static SoumissionCompetitionDto depuis(SoumissionCompetition s) {
        var u = s.getUtilisateur();
        var profil = u.getProfil();
        return new SoumissionCompetitionDto(s.getId(), u.getId(),
                profil != null && profil.getPseudo() != null ? profil.getPseudo() : u.getPrenom(),
                u.getNom(), u.getPrenom(), s.getUrlDepot(), s.getDescription(),
                s.getDateSoumission(), s.getScore(), s.isEvaluee(), s.getRetourEvaluation());
    }
}
