package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.StatutProjet;

import java.util.List;
import java.util.Map;

public record AdminStatistiquesDto(
        Utilisateurs utilisateurs, Projets projets, Communaute communaute, Challenges challenges,
        Mentorat mentorat, long badgesAttribues, List<InscriptionRecenteDto> dernieresInscriptions) {

    public record Utilisateurs(long total, long actifs, long nouveauxSur7Jours) {}

    public record Projets(long total, Map<StatutProjet, Long> parStatut, long demandesEnAttente) {}

    public record Communaute(long questions, long questionsSansSolution, long reponses) {}

    public record Challenges(long total, long reussites) {}

    public record Mentorat(long mentorsActifs, long mentoratsEnCours, long mentoratsTermines) {}
}
