package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.DeveloppeurRecommandeDto;
import com.cadev.backend.dto.sortie.EchangeCompetencesDto;
import com.cadev.backend.dto.sortie.ProjetRecommandeDto;
import com.cadev.backend.dto.sortie.ScoreDto;
import com.cadev.backend.entite.*;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.TypeCompetence;
import com.cadev.backend.exception.ActionInterditeException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private static final int SCORE_MINIMUM = 20;
    private static final double POIDS_COMPETENCES = 0.8; // le reste (0,2) va aux technologies citées

    private final ProjetRepository projets;
    private final UtilisateurRepository utilisateurs;
    private final CompetenceUtilisateurRepository competencesUtilisateur;
    private final MembreProjetRepository membres;
    private final ProfilRepository profils;
    private final RechercheProjetService recherche;
    private final DeveloppeurService developpeurs;

    /** Ce qu'un développeur sait ou veut apprendre sur une compétence donnée. */
    record Possession(boolean sait, Niveau niveau, boolean veutApprendre) {}

    /** Résultat d'un calcul de compatibilité. */
    record Resultat(int score, List<String> correspondantes, List<String> aApprendre, List<String> manquantes) {}

    // ---------- Projets recommandés pour un développeur ----------

    @Transactional(readOnly = true)
    public List<ProjetRecommandeDto> projetsRecommandes(String email, int limite) {
        Utilisateur moi = trouverUtilisateur(email);
        List<CompetenceUtilisateur> mesCompetences = competencesUtilisateur.findAvecCompetence(moi.getId());
        if (mesCompetences.isEmpty()) {
            return List.of(); // sans compétence déclarée, aucune recommandation possible
        }
        Map<Long, Possession> possessions = possessions(mesCompetences);
        Set<String> nomsSus = nomsSus(mesCompetences);

        List<Projet> candidats = projets.findCandidatsPourRecommandation(moi.getId());
        Map<Long, Long> nombreMembres = recherche.compterMembres(candidats);

        record Propose(Projet projet, long membres, Resultat resultat) {}
        List<Propose> proposes = new ArrayList<>();
        for (Projet p : candidats) {
            long nb = nombreMembres.getOrDefault(p.getId(), 0L);
            int places = ProjetService.calculerPlacesRestantes(p, nb);
            if (!ProjetService.estOuvertAuxDemandes(p, places)) {
                continue; // projet complet ou terminé
            }
            Resultat r = scorer(p.getCompetencesRecherchees(), p.getTechnologies(), possessions, nomsSus);
            if (r.score() >= SCORE_MINIMUM) {
                proposes.add(new Propose(p, nb, r));
            }
        }
        proposes.sort((a, b) -> {
            int c = Integer.compare(b.resultat().score(), a.resultat().score());
            return c != 0 ? c : b.projet().getDateCreation().compareTo(a.projet().getDateCreation());
        });

        return proposes.stream().limit(limite)
                .map(x -> new ProjetRecommandeDto(recherche.resume(x.projet(), x.membres()), versDto(x.resultat())))
                .toList();
    }

    // ---------- Développeurs recommandés pour un projet ----------

    @Transactional(readOnly = true)
    public List<DeveloppeurRecommandeDto> developpeursPourProjet(Long projetId, String email, int limite) {
        Projet p = projets.findById(projetId)
                .orElseThrow(() -> new RessourceIntrouvableException("Projet introuvable"));
        Utilisateur moi = trouverUtilisateur(email);
        if (!p.getCreateur().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul le créateur du projet peut voir les développeurs recommandés");
        }

        int places = ProjetService.calculerPlacesRestantes(p, membres.countByProjetId(projetId));
        if (!ProjetService.estOuvertAuxDemandes(p, places)) {
            return List.of();
        }

        List<CompetenceProjet> exigences = p.getCompetencesRecherchees();
        Map<Long, List<CompetenceUtilisateur>> parUtilisateur = competencesUtilisateur
                .findCandidatsPourProjet(projetId).stream()
                .collect(Collectors.groupingBy(cu -> cu.getUtilisateur().getId()));

        record Propose(Long utilisateurId, List<CompetenceUtilisateur> competences, Resultat resultat) {}
        List<Propose> proposes = new ArrayList<>();
        for (Map.Entry<Long, List<CompetenceUtilisateur>> e : parUtilisateur.entrySet()) {
            Resultat r = scorer(exigences, p.getTechnologies(), possessions(e.getValue()), nomsSus(e.getValue()));
            if (r.score() >= SCORE_MINIMUM) {
                proposes.add(new Propose(e.getKey(), e.getValue(), r));
            }
        }
        proposes.sort((a, b) -> {
            int c = Integer.compare(b.resultat().score(), a.resultat().score());
            return c != 0 ? c : Long.compare(a.utilisateurId(), b.utilisateurId());
        });

        List<DeveloppeurRecommandeDto> resultat = new ArrayList<>();
        for (Propose x : proposes) {
            if (resultat.size() >= limite) {
                break;
            }
            Profil profil = profils.findByUtilisateurId(x.utilisateurId()).orElse(null);
            if (profil != null) {
                resultat.add(new DeveloppeurRecommandeDto(
                        developpeurs.resume(profil, x.competences()), versDto(x.resultat())));
            }
        }
        return resultat;
    }

    // ---------- Échanges de compétences (réciproques) ----------

    @Transactional(readOnly = true)
    public List<EchangeCompetencesDto> echanges(String email, int limite) {
        Utilisateur moi = trouverUtilisateur(email);
        List<CompetenceUtilisateur> miennes = competencesUtilisateur.findAvecCompetence(moi.getId());
        Set<Long> aApprendre = idsParType(miennes, TypeCompetence.APPRENDRE);
        Set<Long> aEnseigner = idsParType(miennes, TypeCompetence.ENSEIGNER);
        if (aApprendre.isEmpty() || aEnseigner.isEmpty()) {
            return List.of();
        }

        Set<Long> concernees = new HashSet<>(aApprendre);
        concernees.addAll(aEnseigner);
        Map<Long, List<CompetenceUtilisateur>> parUtilisateur = competencesUtilisateur
                .findAutresPourCompetences(moi.getId(), concernees).stream()
                .collect(Collectors.groupingBy(cu -> cu.getUtilisateur().getId()));

        record Echange(Long utilisateurId, List<String> ilPeutMEnseigner, List<String> jePeuxLuiEnseigner) {}
        List<Echange> echanges = new ArrayList<>();
        for (Map.Entry<Long, List<CompetenceUtilisateur>> e : parUtilisateur.entrySet()) {
            // Il peut m'enseigner ce que je veux apprendre
            List<String> ilEnseigne = e.getValue().stream()
                    .filter(cu -> cu.getType() == TypeCompetence.ENSEIGNER && aApprendre.contains(cu.getCompetence().getId()))
                    .map(cu -> cu.getCompetence().getNom()).distinct().sorted().toList();
            // Il veut apprendre ce que je peux enseigner
            List<String> ilApprend = e.getValue().stream()
                    .filter(cu -> cu.getType() == TypeCompetence.APPRENDRE && aEnseigner.contains(cu.getCompetence().getId()))
                    .map(cu -> cu.getCompetence().getNom()).distinct().sorted().toList();
            if (!ilEnseigne.isEmpty() && !ilApprend.isEmpty()) { // seulement les échanges réciproques
                echanges.add(new Echange(e.getKey(), ilEnseigne, ilApprend));
            }
        }
        echanges.sort((a, b) -> {
            int c = Integer.compare(b.ilPeutMEnseigner().size() + b.jePeuxLuiEnseigner().size(),
                    a.ilPeutMEnseigner().size() + a.jePeuxLuiEnseigner().size());
            return c != 0 ? c : Long.compare(a.utilisateurId(), b.utilisateurId());
        });

        List<Echange> retenus = echanges.stream().limit(limite).toList();
        if (retenus.isEmpty()) {
            return List.of();
        }
        Map<Long, List<CompetenceUtilisateur>> competencesCompletes = competencesUtilisateur
                .findParUtilisateurs(retenus.stream().map(Echange::utilisateurId).toList()).stream()
                .collect(Collectors.groupingBy(cu -> cu.getUtilisateur().getId()));

        List<EchangeCompetencesDto> resultat = new ArrayList<>();
        for (Echange x : retenus) {
            Profil profil = profils.findByUtilisateurId(x.utilisateurId()).orElse(null);
            if (profil != null) {
                resultat.add(new EchangeCompetencesDto(
                        developpeurs.resume(profil, competencesCompletes.getOrDefault(x.utilisateurId(), List.of())),
                        x.ilPeutMEnseigner(), x.jePeuxLuiEnseigner()));
            }
        }
        return resultat;
    }

    // ---------- Le calcul du score (pur : pas d'accès à la base) ----------

    static Resultat scorer(List<CompetenceProjet> exigences, String technologies,
                           Map<Long, Possession> possessions, Set<String> nomsSus) {
        double somme = 0;
        double poidsTotal = 0;
        List<String> correspondantes = new ArrayList<>();
        List<String> aApprendre = new ArrayList<>();
        List<String> manquantes = new ArrayList<>();

        for (CompetenceProjet cp : exigences) {
            double poids = cp.isObligatoire() ? 2 : 1;
            String nom = cp.getCompetence().getNom();
            Possession p = possessions.get(cp.getCompetence().getId());
            double credit = 0;

            if (p != null && p.sait()) {
                Niveau requis = cp.getNiveauRequis() != null ? cp.getNiveauRequis() : Niveau.DEBUTANT;
                // Niveau non précisé : on lui fait confiance
                boolean niveauSuffisant = p.niveau() == null || p.niveau().ordinal() >= requis.ordinal();
                credit = niveauSuffisant ? 1.0 : 0.5;
                correspondantes.add(nom);
            } else if (p != null && p.veutApprendre()) {
                credit = 0.25;
                aApprendre.add(nom);
            } else {
                manquantes.add(nom);
            }
            somme += credit * poids;
            poidsTotal += poids;
        }

        Double scoreCompetences = poidsTotal > 0 ? somme / poidsTotal : null;
        Double scoreTechnologies = scoreTechnologies(technologies, nomsSus);

        double total;
        if (scoreCompetences != null && scoreTechnologies != null) {
            total = POIDS_COMPETENCES * scoreCompetences + (1 - POIDS_COMPETENCES) * scoreTechnologies;
        } else if (scoreCompetences != null) {
            total = scoreCompetences;
        } else if (scoreTechnologies != null) {
            total = scoreTechnologies;
        } else {
            total = 0;
        }
        return new Resultat((int) Math.round(total * 100), correspondantes, aApprendre, manquantes);
    }

    private static Double scoreTechnologies(String technologies, Set<String> nomsSus) {
        if (technologies == null || technologies.isBlank()) {
            return null;
        }
        List<String> jetons = Arrays.stream(technologies.split("[,;|\\n]"))
                .map(ChallengeService::normaliser)
                .filter(s -> !s.isEmpty())
                .toList();
        if (jetons.isEmpty()) {
            return null;
        }
        long trouvees = jetons.stream().filter(nomsSus::contains).count();
        return Math.min(1.0, trouvees / (double) jetons.size());
    }

    static Map<Long, Possession> possessions(List<CompetenceUtilisateur> liste) {
        Map<Long, Possession> resultat = new HashMap<>();
        for (CompetenceUtilisateur cu : liste) {
            Long id = cu.getCompetence().getId();
            Possession actuelle = resultat.getOrDefault(id, new Possession(false, null, false));
            boolean sait = actuelle.sait();
            Niveau niveau = actuelle.niveau();
            boolean veut = actuelle.veutApprendre();

            if (cu.getType() == TypeCompetence.APPRENDRE) {
                veut = true;
            } else { // MAITRISE ou ENSEIGNER
                sait = true;
                if (cu.getNiveau() != null && (niveau == null || cu.getNiveau().ordinal() > niveau.ordinal())) {
                    niveau = cu.getNiveau(); // on retient le meilleur niveau déclaré
                }
            }
            resultat.put(id, new Possession(sait, niveau, veut));
        }
        return resultat;
    }

    static Set<String> nomsSus(List<CompetenceUtilisateur> liste) {
        return liste.stream()
                .filter(cu -> cu.getType() != TypeCompetence.APPRENDRE)
                .map(cu -> ChallengeService.normaliser(cu.getCompetence().getNom()))
                .collect(Collectors.toSet());
    }

    private static ScoreDto versDto(Resultat r) {
        String niveau = r.score() >= 70 ? "ELEVE" : r.score() >= 40 ? "MOYEN" : "FAIBLE";
        return new ScoreDto(r.score(), niveau, r.correspondantes(), r.aApprendre(), r.manquantes());
    }

    private static Set<Long> idsParType(List<CompetenceUtilisateur> liste, TypeCompetence type) {
        return liste.stream().filter(cu -> cu.getType() == type)
                .map(cu -> cu.getCompetence().getId()).collect(Collectors.toSet());
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }
}