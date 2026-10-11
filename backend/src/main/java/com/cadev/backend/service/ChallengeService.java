package com.cadev.backend.service;

import com.cadev.backend.dto.entree.ChallengeRequete;
import com.cadev.backend.dto.entree.ReponseChallengeRequete;
import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.entite.Challenge;
import com.cadev.backend.entite.ParticipationChallenge;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.StatutParticipation;
import com.cadev.backend.enumeration.TypeChallenge;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.ChallengeRepository;
import com.cadev.backend.repository.ParticipationChallengeRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.specifications.ChallengeSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private static final ZoneId FUSEAU = ZoneId.of("Africa/Dakar");
    private static final int TAILLE_MAX = 50;

    private final ChallengeRepository challenges;
    private final ParticipationChallengeRepository participations;
    private final UtilisateurRepository utilisateurs;
    private final BadgeService badges;


    // ---------- Lecture ----------

    @Transactional(readOnly = true)
    public PageDto<ChallengeResumeDto> lister(String email, TypeChallenge type, DifficulteChallenge difficulte,
                                              Boolean ouvert, int page, int taille) {
        Utilisateur moi = trouverUtilisateur(email);
        LocalDate jour = aujourdhui();
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX),
                Sort.by(Sort.Order.desc("dateDebut"), Sort.Order.desc("id")));

        Page<Challenge> resultat = challenges.findAll(
                ChallengeSpecifications.filtres(type, difficulte, ouvert, jour), pageable);

        List<Long> ids = resultat.getContent().stream().map(Challenge::getId).toList();
        Map<Long, ParticipationChallenge> mesParticipations = ids.isEmpty()
                ? Map.of()
                : participations.findByUtilisateurIdAndChallengeIdIn(moi.getId(), ids).stream()
                .collect(Collectors.toMap(p -> p.getChallenge().getId(), p -> p));
        Map<Long, Long> reussites = compterReussites(ids);

        List<ChallengeResumeDto> contenu = resultat.getContent().stream().map(c -> new ChallengeResumeDto(
                c.getId(), c.getTitre(), c.getType(), c.getDifficulte(), c.getPoints(),
                c.getDateDebut(), c.getDateFin(), estOuvert(c, jour),
                reussites.getOrDefault(c.getId(), 0L),
                versDto(mesParticipations.get(c.getId()), c))).toList();
        return PageDto.depuis(resultat, contenu);
    }

    @Transactional(readOnly = true)
    public ChallengeDetailDto duJour(String email) {
        Utilisateur moi = trouverUtilisateur(email);
        LocalDate jour = aujourdhui();
        List<Challenge> ouverts = challenges.findOuverts(jour);
        if (ouverts.isEmpty()) {
            throw new RessourceIntrouvableException("Aucun challenge n'est ouvert aujourd'hui");
        }
        // Rotation quotidienne, sans planification manuelle
        Challenge c = ouverts.get(jour.getDayOfYear() % ouverts.size());
        return construireDetail(c, moi);
    }

    @Transactional(readOnly = true)
    public ChallengeDetailDto duJourOuNull(String email) {
        Utilisateur moi = trouverUtilisateur(email);
        LocalDate jour = aujourdhui();
        List<Challenge> ouverts = challenges.findOuverts(jour);
        if (ouverts.isEmpty()) {
            return null;
        }
        return construireDetail(ouverts.get(jour.getDayOfYear() % ouverts.size()), moi);
    }


    @Transactional(readOnly = true)
    public ChallengeDetailDto detail(Long id, String email) {
        return construireDetail(trouverChallengeVisible(id), trouverUtilisateur(email));
    }

    // ---------- Réponse ----------

    @Transactional
    public ResultatChallengeDto repondre(Long challengeId, String email, ReponseChallengeRequete req) {
        Challenge c = trouverChallengeVisible(challengeId);
        Utilisateur moi = trouverUtilisateur(email);

        if (!estOuvert(c, aujourdhui())) {
            throw new ConflitException("Ce challenge est terminé : les réponses ne sont plus acceptées");
        }

        ParticipationChallenge p = participations.findPourMiseAJour(challengeId, moi.getId()).orElseGet(() -> {
            ParticipationChallenge nouvelle = new ParticipationChallenge();
            nouvelle.setChallenge(c);
            nouvelle.setUtilisateur(moi);
            return participations.save(nouvelle);
        });

        if (p.getStatut() == StatutParticipation.REUSSIE) {
            throw new ConflitException("Vous avez déjà réussi ce challenge");
        }
        if (p.getStatut() == StatutParticipation.ECHOUEE || p.getNombreEssais() >= c.getNombreEssaisMax()) {
            throw new ConflitException("Vous avez utilisé tous vos essais pour ce challenge");
        }

        String reponse = req.reponse().trim();
        p.setNombreEssais(p.getNombreEssais() + 1);
        p.setDerniereReponse(reponse);

        boolean correct = estCorrecte(c, reponse);
        if (correct) {
            p.setStatut(StatutParticipation.REUSSIE);
            p.setScore(c.getPoints());
            p.setDateReussite(LocalDateTime.now(FUSEAU));
            badges.evaluer(moi.getId());
        } else if (p.getNombreEssais() >= c.getNombreEssaisMax()) {
            p.setStatut(StatutParticipation.ECHOUEE);
        }

        int restants = correct ? 0 : Math.max(0, c.getNombreEssaisMax() - p.getNombreEssais());
        boolean explicationVisible = p.getStatut() != StatutParticipation.EN_COURS;
        return new ResultatChallengeDto(correct, p.getStatut(), restants, p.getScore(),
                explicationVisible ? c.getExplication() : null);
    }

    // ---------- Classement ----------

    @Transactional(readOnly = true)
    public ClassementDto classement(String email, int page, int taille) {
        Utilisateur moi = trouverUtilisateur(email);
        int tailleSure = Math.min(Math.max(taille, 1), TAILLE_MAX);
        int pageSure = Math.max(page, 0);

        List<Object[]> lignes = participations.classement(PageRequest.of(pageSure, tailleSure));
        long total = participations.compterClasses();

        List<Long> ids = lignes.stream().map(l -> ((Number) l[0]).longValue()).toList();
        Map<Long, Utilisateur> parId = utilisateurs.findAllById(ids).stream()
                .collect(Collectors.toMap(Utilisateur::getId, u -> u));

        List<ClassementLigneDto> contenu = new ArrayList<>();
        for (int i = 0; i < lignes.size(); i++) {
            Object[] l = lignes.get(i);
            Utilisateur u = parId.get(((Number) l[0]).longValue());
            contenu.add(new ClassementLigneDto(pageSure * tailleSure + i + 1,
                    UtilisateurResumeDto.depuis(u), ((Number) l[1]).intValue(), ((Number) l[2]).intValue()));
        }

        // Mon rang : position dans le classement complet (suffisant à l'échelle du MVP)
        MonRangDto moiRang = new MonRangDto(null, 0, 0);
        List<Object[]> tous = participations.classement(PageRequest.of(0, 10000));
        for (int i = 0; i < tous.size(); i++) {
            if (((Number) tous.get(i)[0]).longValue() == moi.getId()) {
                moiRang = new MonRangDto(i + 1, ((Number) tous.get(i)[1]).intValue(),
                        ((Number) tous.get(i)[2]).intValue());
                break;
            }
        }

        int totalPages = (int) Math.ceil(total / (double) tailleSure);
        return new ClassementDto(new PageDto<>(contenu, pageSure, tailleSure, total, totalPages), moiRang);
    }

    // ---------- Administration ----------

    @Transactional
    public ChallengeDetailDto creer(String email, ChallengeRequete req) {
        if (req.dateFin().isBefore(req.dateDebut())) {
            throw new RequeteInvalideException("La date de fin ne peut pas précéder la date de début");
        }
        List<String> reponses = req.reponsesAcceptees().stream().map(String::trim).toList();
        if (reponses.stream().anyMatch(r -> r.contains("|"))) {
            throw new RequeteInvalideException("Une réponse acceptée ne peut pas contenir le caractère |");
        }
        String reponsesJointes = String.join("|", reponses);
        if (reponsesJointes.length() > 500) {
            throw new RequeteInvalideException("Les réponses acceptées sont trop longues (500 caractères au total)");
        }

        Challenge c = new Challenge();
        c.setTitre(req.titre().trim());
        c.setEnonce(req.enonce().trim());
        c.setExtraitCode(req.extraitCode());
        c.setLangage(req.langage());
        c.setType(req.type());
        c.setDifficulte(req.difficulte());
        c.setPoints(pointsPour(req.difficulte()));
        c.setReponsesAcceptees(reponsesJointes);
        c.setExplication(req.explication());
        c.setNombreEssaisMax(req.nombreEssaisMax());
        c.setDateDebut(req.dateDebut());
        c.setDateFin(req.dateFin());
        challenges.save(c);
        return construireDetail(c, trouverUtilisateur(email));
    }

    // ---------- Règles réutilisables ----------

    public static int pointsPour(DifficulteChallenge difficulte) {
        return switch (difficulte) {
            case FACILE -> 10;
            case MOYEN -> 20;
            case DIFFICILE -> 30;
        };
    }

    /** Minuscules, sans accents, sans espaces : « Injection  SQL » devient « injectionsql ». */
    static String normaliser(String texte) {
        String sansAccents = Normalizer.normalize(texte, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return sansAccents.toLowerCase(Locale.ROOT).replaceAll("\\s+", "");
    }

    static boolean estCorrecte(Challenge c, String reponse) {
        String proposee = normaliser(reponse);
        return Arrays.stream(c.getReponsesAcceptees().split("\\|"))
                .map(ChallengeService::normaliser)
                .anyMatch(proposee::equals);
    }

    // ---------- Méthodes privées ----------

    private static LocalDate aujourdhui() {
        return LocalDate.now(FUSEAU);
    }

    private static boolean estOuvert(Challenge c, LocalDate jour) {
        return !c.getDateDebut().isAfter(jour) && !c.getDateFin().isBefore(jour);
    }

    private ChallengeDetailDto construireDetail(Challenge c, Utilisateur moi) {
        LocalDate jour = aujourdhui();
        boolean ouvert = estOuvert(c, jour);
        ParticipationChallenge p = participations
                .findByChallengeIdAndUtilisateurId(c.getId(), moi.getId()).orElse(null);

        // L'explication est révélée après une réussite, des essais épuisés, ou la fin du challenge
        boolean explicationVisible = !ouvert || (p != null && p.getStatut() != StatutParticipation.EN_COURS);
        long reussites = participations.countByChallengeIdAndStatut(c.getId(), StatutParticipation.REUSSIE);

        return new ChallengeDetailDto(c.getId(), c.getTitre(), c.getEnonce(), c.getExtraitCode(), c.getLangage(),
                c.getType(), c.getDifficulte(), c.getPoints(), c.getNombreEssaisMax(),
                c.getDateDebut(), c.getDateFin(), ouvert, reussites, versDto(p, c),
                explicationVisible ? c.getExplication() : null);
    }

    private MaParticipationDto versDto(ParticipationChallenge p, Challenge c) {
        if (p == null) {
            return null;
        }
        int restants = p.getStatut() == StatutParticipation.REUSSIE
                ? 0 : Math.max(0, c.getNombreEssaisMax() - p.getNombreEssais());
        return new MaParticipationDto(p.getStatut(), p.getNombreEssais(), restants,
                p.getScore(), p.getDerniereReponse());
    }

    private Map<Long, Long> compterReussites(List<Long> ids) {
        Map<Long, Long> resultat = new HashMap<>();
        if (ids.isEmpty()) {
            return resultat;
        }
        for (Object[] ligne : participations.compterParChallenge(ids, StatutParticipation.REUSSIE)) {
            resultat.put(((Number) ligne[0]).longValue(), ((Number) ligne[1]).longValue());
        }
        return resultat;
    }

    /** Un challenge qui n'a pas encore commencé est traité comme inexistant. */
    private Challenge trouverChallengeVisible(Long id) {
        return challenges.findById(id)
                .filter(c -> !c.getDateDebut().isAfter(aujourdhui()))
                .orElseThrow(() -> new RessourceIntrouvableException("Challenge introuvable"));
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }

}