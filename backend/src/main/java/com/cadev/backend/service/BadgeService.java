package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.BadgeDto;
import com.cadev.backend.dto.sortie.BadgeObtenuDto;
import com.cadev.backend.dto.sortie.ProgressionDto;
import com.cadev.backend.entite.Badge;
import com.cadev.backend.entite.BadgeUtilisateur;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.StatutParticipation;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.ToLongFunction;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badges;
    private final BadgeUtilisateurRepository badgesUtilisateur;
    private final UtilisateurRepository utilisateurs;
    private final ReponseRepository reponses;
    private final QuestionRepository questions;
    private final ParticipationChallengeRepository participations;
    private final MembreProjetRepository membres;
    private final SeanceMentoratRepository seancesMentorat;

    /** Tout ce qu'on sait compter sur un utilisateur pour décider des badges. */
    private record Statistiques(long reponsesAcceptees, long contributions, long challengesReussis,
                                long joursChallenge, long projetsRejoints, long projetsTermines, long seancesAnimees) {}

    private record DefinitionBadge(String code, String nom, String description, int objectif,
                                   ToLongFunction<Statistiques> valeur) {}

    // Les seuils et les textes sont ici, et nulle part ailleurs
    private static final List<DefinitionBadge> DEFINITIONS = List.of(
            new DefinitionBadge("PROBLEM_SOLVER", "Problem Solver",
                    "Trois de vos réponses ont été choisies comme solution par d'autres membres.",
                    3, Statistiques::reponsesAcceptees),
            new DefinitionBadge("COLLABORATEUR", "Collaborateur",
                    "Vous participez à au moins 2 projets.",
                    2, Statistiques::projetsRejoints),
            new DefinitionBadge("CHALLENGE_MASTER", "Challenge Master",
                    "Vous avez réussi 5 challenges.",
                    5, Statistiques::challengesReussis),
            new DefinitionBadge("KNOWLEDGE_SHARER", "Knowledge Sharer",
                    "Vous avez contribué 5 fois à la communauté (questions posées et réponses données aux autres).",
                    5, Statistiques::contributions),
            new DefinitionBadge("BUILDER", "Builder",
                    "Vous avez participé à un projet terminé.",
                    1, Statistiques::projetsTermines),
            new DefinitionBadge("RISING_DEVELOPER", "Rising Developer",
                    "Vous avez réussi des challenges sur 3 jours différents.",
                    3, Statistiques::joursChallenge),
            new DefinitionBadge("MENTOR", "Mentor",
                    "Vous avez animé 2 séances de mentorat avec compte rendu.",
                    2, Statistiques::seancesAnimees)
    );

    /** Crée ou met à jour le catalogue en base (appelé au démarrage). */
    @Transactional
    public void synchroniserCatalogue() {
        for (DefinitionBadge d : DEFINITIONS) {
            Badge b = badges.findByCode(d.code()).orElseGet(Badge::new);
            b.setCode(d.code());
            b.setNom(d.nom());
            b.setDescription(d.description());
            badges.save(b);
        }
    }

    /** Attribue les badges dont les conditions sont remplies. Retourne les codes des nouveaux badges. */
    @Transactional
    public List<String> evaluer(Long utilisateurId) {
        Statistiques s = calculer(utilisateurId);
        List<String> nouveaux = new ArrayList<>();
        for (DefinitionBadge d : DEFINITIONS) {
            boolean condition = d.valeur().applyAsLong(s) >= d.objectif();
            if (condition && !badgesUtilisateur.existsByUtilisateurIdAndBadgeCode(utilisateurId, d.code())) {
                Badge badge = badges.findByCode(d.code())
                        .orElseThrow(() -> new IllegalStateException("Badge absent du catalogue : " + d.code()));
                BadgeUtilisateur bu = new BadgeUtilisateur();
                bu.setUtilisateur(utilisateurs.getReferenceById(utilisateurId));
                bu.setBadge(badge);
                badgesUtilisateur.save(bu);
                nouveaux.add(d.code());
            }
        }
        return nouveaux;
    }

    /** Les 6 badges, obtenus ou non, avec la progression de l'utilisateur connecté. */
    @Transactional(readOnly = true)
    public List<BadgeDto> catalogue(String email) {
        Utilisateur moi = utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
        Statistiques s = calculer(moi.getId());
        Map<String, BadgeUtilisateur> obtenus = badgesUtilisateur.findAvecBadge(moi.getId()).stream()
                .collect(Collectors.toMap(bu -> bu.getBadge().getCode(), bu -> bu));

        return DEFINITIONS.stream().map(d -> {
            BadgeUtilisateur bu = obtenus.get(d.code());
            int actuel = (int) Math.min(d.valeur().applyAsLong(s), d.objectif());
            return new BadgeDto(d.code(), d.nom(), d.description(), bu != null,
                    bu != null ? bu.getDateObtention() : null, new ProgressionDto(actuel, d.objectif()));
        }).toList();
    }

    /** Les badges obtenus par un utilisateur (pour son profil public). */
    @Transactional(readOnly = true)
    public List<BadgeObtenuDto> badgesObtenus(Long utilisateurId) {
        return badgesUtilisateur.findAvecBadge(utilisateurId).stream().map(BadgeObtenuDto::depuis).toList();
    }

    private Statistiques calculer(Long id) {
        long jours = participations.datesReussites(id).stream()
                .map(LocalDateTime::toLocalDate).distinct().count();
        return new Statistiques(
                reponses.compterSolutions(id),
                questions.countByAuteurId(id) + reponses.compterReponsesAuxAutres(id),
                participations.countByUtilisateurIdAndStatut(id, StatutParticipation.REUSSIE),
                jours,
                membres.countByUtilisateurId(id),
                membres.compterProjetsTermines(id),
                seancesMentorat.compterSeancesAnimees(id));
    }
}