package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.entite.CompetenceUtilisateur;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.*;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UtilisateurRepository utilisateurs;
    private final ProfilRepository profils;
    private final CompetenceUtilisateurRepository competencesUtilisateur;
    private final QuestionRepository questions;
    private final RechercheProjetService recherche;
    private final DemandeService demandeService;
    private final ChallengeService challengeService;
    private final BadgeService badgeService;
    private final MatchingService matching;
    private final MentoratRepository mentorats;
    private final InvitationProjetRepository invitations;

    @Transactional(readOnly = true)
    public DashboardDto construire(String email) {
        Utilisateur moi = utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
        List<CompetenceUtilisateur> mesCompetences = competencesUtilisateur.findAvecCompetence(moi.getId());

        // Mes projets et les demandes à traiter
        List<MonProjetDto> mesProjets = recherche.mesProjets(email);
        int demandesATraiter = mesProjets.stream().mapToInt(MonProjetDto::demandesEnAttente).sum();
        List<DemandeDto> mesDemandes = demandeService.mesDemandes(email).stream()
                .filter(d -> d.statut() == StatutDemande.EN_ATTENTE).limit(5).toList();

        // Collaborateurs recommandés pour mes projets encore ouverts (2 projets, 3 candidats chacun)
        List<CollaborateurRecommandeDto> collaborateurs = new ArrayList<>();
        mesProjets.stream()
                .filter(p -> p.roleMembre() == RoleMembre.CREATEUR && p.ouvertAuxDemandes())
                .limit(2)
                .forEach(p -> matching.developpeursPourProjet(p.id(), email, 3)
                        .forEach(c -> collaborateurs.add(new CollaborateurRecommandeDto(p.id(), p.nom(), c))));

        // Échanges de compétences
        List<EchangeCompetencesDto> echanges = matching.echanges(email, 20);
        EchangesDto echangesDto = new EchangesDto(echanges.size(), echanges.stream().limit(3).toList());

        // Badges
        List<BadgeDto> catalogue = badgeService.catalogue(email);
        BadgesResumeDto badges = new BadgesResumeDto(
                (int) catalogue.stream().filter(BadgeDto::obtenu).count(), catalogue.size());

        return new DashboardDto(
                UtilisateurResumeDto.depuis(moi),
                profilComplet(moi, mesCompetences.size()),
                demandesATraiter,
                (int) invitations.countByInviteIdAndStatut(moi.getId(), StatutInvitation.EN_ATTENTE),
                (int) mentorats.countByMentorIdAndStatut(moi.getId(), StatutMentorat.EN_ATTENTE),
                mesProjets.stream().limit(6).toList(),
                mesDemandes,
                challengeService.duJourOuNull(email),
                matching.projetsRecommandes(email, 3),
                collaborateurs,
                questionsPourMoi(moi, mesCompetences, 3),
                echangesDto,
                badges);
    }

    private ProfilCompletDto profilComplet(Utilisateur moi, int nombreCompetences) {
        Profil p = profils.findByUtilisateurId(moi.getId()).orElse(null);
        List<String> manquants = new ArrayList<>();
        if (p == null || vide(p.getBio())) manquants.add("BIO");
        if (p == null || vide(p.getPays())) manquants.add("PAYS");
        if (p == null || vide(p.getVille())) manquants.add("VILLE");
        if (p == null || vide(p.getDisponibilite())) manquants.add("DISPONIBILITE");
        if (p == null || (vide(p.getGithub()) && vide(p.getLinkedin()) && vide(p.getPortfolio()))) manquants.add("LIEN");
        if (nombreCompetences < 3) manquants.add("COMPETENCES");
        int pourcentage = (int) Math.round((6 - manquants.size()) * 100 / 6.0);
        return new ProfilCompletDto(pourcentage, manquants);
    }

    /** Questions sans solution, posées par d'autres, qui mentionnent une compétence que je maîtrise. */
    private List<QuestionResumeDto> questionsPourMoi(Utilisateur moi, List<CompetenceUtilisateur> mesCompetences, int limite) {
        List<Pattern> motifs = mesCompetences.stream()
                .filter(cu -> cu.getType() != TypeCompetence.APPRENDRE)
                .map(cu -> cu.getCompetence().getNom()).distinct()
                // Le mot doit être entier : « java » ne doit pas correspondre à « javascript »
                .map(nom -> Pattern.compile("(?<![\\p{L}\\p{N}])" + Pattern.quote(sansAccents(nom)) + "(?![\\p{L}\\p{N}])"))
                .toList();
        if (motifs.isEmpty()) {
            return List.of();
        }
        return questions.findTop50ByResolueFalseAndAuteurIdNotOrderByDateCreationDesc(moi.getId()).stream()
                .filter(q -> {
                    String texte = sansAccents(q.getTitre() + " " + (q.getCategorie() == null ? "" : q.getCategorie())
                            + " " + q.getContenu());
                    return motifs.stream().anyMatch(m -> m.matcher(texte).find());
                })
                .limit(limite)
                .map(q -> new QuestionResumeDto(q.getId(), q.getTitre(),
                        q.getContenu().length() > 200 ? q.getContenu().substring(0, 200) + "…" : q.getContenu(),
                        q.getCategorie(), q.getNombreReponses(), q.isResolue(), q.getDateCreation(),
                        UtilisateurResumeDto.depuis(q.getAuteur())))
                .toList();
    }

    private static boolean vide(String texte) {
        return texte == null || texte.isBlank();
    }

    private static String sansAccents(String texte) {
        return Normalizer.normalize(texte, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);
    }
}