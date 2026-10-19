package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.entite.Challenge;
import com.cadev.backend.entite.Question;
import com.cadev.backend.entite.Reponse;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.*;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.*;
import com.cadev.backend.service.specifications.AdminSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final int TAILLE_MAX = 50;

    private final UtilisateurRepository utilisateurs;
    private final ProjetRepository projets;
    private final DemandeAdhesionRepository demandes;
    private final QuestionRepository questions;
    private final ReponseRepository reponses;
    private final ChallengeRepository challenges;
    private final ParticipationChallengeRepository participations;
    private final ProfilMentorRepository profilsMentor;
    private final MentoratRepository mentorats;
    private final BadgeUtilisateurRepository badgesUtilisateur;

    // ---------- Statistiques ----------

    @Transactional(readOnly = true)
    public AdminStatistiquesDto statistiques() {
        Map<StatutProjet, Long> parStatut = new EnumMap<>(StatutProjet.class);
        for (StatutProjet s : StatutProjet.values()) {
            parStatut.put(s, 0L);
        }
        for (Object[] ligne : projets.compterParStatut()) {
            parStatut.put((StatutProjet) ligne[0], ((Number) ligne[1]).longValue());
        }

        List<InscriptionRecenteDto> dernieres = utilisateurs.findTop5ByOrderByDateInscriptionDesc().stream()
                .map(u -> new InscriptionRecenteDto(u.getId(), u.getPrenom(), u.getNom(), u.getEmail(), u.getDateInscription()))
                .toList();

        return new AdminStatistiquesDto(
                new AdminStatistiquesDto.Utilisateurs(utilisateurs.count(), utilisateurs.countByActifTrue(),
                        utilisateurs.countByDateInscriptionAfter(LocalDateTime.now().minusDays(7))),
                new AdminStatistiquesDto.Projets(projets.count(), parStatut,
                        demandes.countByStatut(StatutDemande.EN_ATTENTE)),
                new AdminStatistiquesDto.Communaute(questions.count(), questions.countByResolueFalse(), reponses.count()),
                new AdminStatistiquesDto.Challenges(challenges.count(),
                        participations.countByStatut(StatutParticipation.REUSSIE)),
                new AdminStatistiquesDto.Mentorat(profilsMentor.countByActifTrue(),
                        mentorats.countByStatut(StatutMentorat.ACCEPTE), mentorats.countByStatut(StatutMentorat.TERMINE)),
                badgesUtilisateur.count(),
                dernieres);
    }

    // ---------- Utilisateurs ----------

    @Transactional(readOnly = true)
    public PageDto<AdminUtilisateurDto> utilisateurs(String texte, Role role, Boolean actif, int page, int taille) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX),
                Sort.by(Sort.Direction.DESC, "dateInscription"));
        Page<Utilisateur> resultat = utilisateurs.findAll(AdminSpecifications.utilisateurs(texte, role, actif), pageable);
        return PageDto.depuis(resultat, resultat.getContent().stream().map(AdminUtilisateurDto::depuis).toList());
    }

    @Transactional
    public AdminUtilisateurDto changerActif(Long id, boolean actif, String emailAdmin) {
        Utilisateur cible = utilisateurs.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
        Utilisateur moi = utilisateurs.findByEmail(emailAdmin)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));

        if (cible.getId().equals(moi.getId())) {
            throw new ConflitException("Vous ne pouvez pas désactiver votre propre compte");
        }
        if (cible.getRole() == Role.ADMIN) {
            throw new ConflitException("Un compte administrateur ne peut pas être désactivé depuis l'interface");
        }
        cible.setActif(actif);
        return AdminUtilisateurDto.depuis(cible);
    }

    // ---------- Challenges ----------

    @Transactional(readOnly = true)
    public PageDto<AdminChallengeDto> challenges(int page, int taille) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX),
                Sort.by(Sort.Order.desc("dateDebut"), Sort.Order.desc("id")));
        Page<Challenge> resultat = challenges.findAll(pageable);

        List<Long> ids = resultat.getContent().stream().map(Challenge::getId).toList();
        Map<Long, Long> participants = compter(ids.isEmpty() ? List.of() : participations.compterParticipants(ids));
        Map<Long, Long> reussites = compter(ids.isEmpty() ? List.of()
                : participations.compterParChallenge(ids, StatutParticipation.REUSSIE));

        List<AdminChallengeDto> contenu = resultat.getContent().stream().map(c -> new AdminChallengeDto(
                c.getId(), c.getTitre(), c.getType(), c.getDifficulte(), c.getPoints(), c.getDateDebut(), c.getDateFin(),
                c.getNombreEssaisMax(), List.of(c.getReponsesAcceptees().split("\\|")),
                participants.getOrDefault(c.getId(), 0L), reussites.getOrDefault(c.getId(), 0L))).toList();
        return PageDto.depuis(resultat, contenu);
    }

    private Map<Long, Long> compter(List<Object[]> lignes) {
        Map<Long, Long> resultat = new HashMap<>();
        for (Object[] l : lignes) {
            resultat.put(((Number) l[0]).longValue(), ((Number) l[1]).longValue());
        }
        return resultat;
    }

    // ---------- Modération des questions et réponses ----------

    @Transactional
    public void supprimerQuestion(Long id) {
        Question q = questions.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Question introuvable"));
        reponses.deleteByQuestionId(id);
        questions.delete(q);
    }

    @Transactional
    public void supprimerReponse(Long questionId, Long reponseId) {
        Reponse r = reponses.findById(reponseId)
                .filter(x -> x.getQuestion().getId().equals(questionId))
                .orElseThrow(() -> new RessourceIntrouvableException("Réponse introuvable"));
        Question q = r.getQuestion();
        boolean etaitSolution = r.isSolution();

        reponses.delete(r);
        q.setNombreReponses(Math.max(0, q.getNombreReponses() - 1));
        if (etaitSolution) {
            q.setResolue(false);
        }
    }
}