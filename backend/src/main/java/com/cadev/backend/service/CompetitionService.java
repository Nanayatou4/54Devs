package com.cadev.backend.service;

import com.cadev.backend.dto.entree.CompetitionRequete;
import com.cadev.backend.dto.entree.EvaluationCompetitionRequete;
import com.cadev.backend.dto.entree.SoumissionCompetitionRequete;
import com.cadev.backend.dto.sortie.CompetitionDto;
import com.cadev.backend.dto.sortie.SoumissionCompetitionDto;
import com.cadev.backend.entite.Competition;
import com.cadev.backend.entite.SoumissionCompetition;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.CompetitionRepository;
import com.cadev.backend.repository.SoumissionCompetitionRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompetitionService {
    private static final ZoneId FUSEAU = ZoneId.of("Africa/Dakar");
    private final CompetitionRepository competitions;
    private final SoumissionCompetitionRepository soumissions;
    private final UtilisateurRepository utilisateurs;
    private final BadgeService badgeService;

    @Transactional(readOnly = true)
    public List<CompetitionDto> lister(String email) {
        Utilisateur moi = utilisateur(email);
        return competitions.findByPublieeTrueOrderByDateDebutDesc().stream().map(c -> {
            SoumissionCompetition s = soumissions.findByCompetitionIdAndUtilisateurId(c.getId(), moi.getId()).orElse(null);
            return CompetitionDto.depuis(c, s != null, s == null ? null : s.getScore(), statut(c));
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<CompetitionDto> listerAdmin() {
        return competitions.findAllByOrderByDateDebutDesc().stream()
                .map(c -> CompetitionDto.depuis(c, false, null, statut(c))).toList();
    }

    @Transactional
    public CompetitionDto creer(String email, CompetitionRequete req) {
        if (!req.dateFin().isAfter(req.dateDebut())) throw new RequeteInvalideException("La date de fin doit être postérieure à la date de début.");
        Competition c = new Competition();
        c.setTitre(req.titre().trim());
        c.setDescription(req.description().trim());
        c.setTheme(req.theme().trim());
        c.setType(req.type());
        c.setDateDebut(req.dateDebut());
        c.setDateFin(req.dateFin());
        c.setPointsMaximum(req.pointsMaximum());
        c.setCreateur(utilisateur(email));
        competitions.save(c);
        return CompetitionDto.depuis(c, false, null, statut(c));
    }

    @Transactional
    public CompetitionDto soumettre(Long id, String email, SoumissionCompetitionRequete req) {
        Competition c = trouverCompetition(id);
        LocalDateTime maintenant = LocalDateTime.now(FUSEAU);
        if (maintenant.isBefore(c.getDateDebut()) || !maintenant.isBefore(c.getDateFin()))
            throw new ConflitException("Cette compétition n'accepte pas de soumission actuellement.");
        if (c.getType() != com.cadev.backend.enumeration.TypeCompetition.SOLO)
            throw new ConflitException("Les soumissions en équipe ne sont pas encore disponibles.");
        Utilisateur moi = utilisateur(email);
        if (soumissions.findByCompetitionIdAndUtilisateurId(id, moi.getId()).isPresent())
            throw new ConflitException("Vous avez déjà soumis une solution pour cette compétition.");
        String url = req.urlDepot().trim();
        if (!url.matches("https?://(www\\.)?github\\.com/[^\\s]+"))
            throw new RequeteInvalideException("Le dépôt doit être une URL GitHub valide.");
        SoumissionCompetition s = new SoumissionCompetition();
        s.setCompetition(c);
        s.setUtilisateur(moi);
        s.setUrlDepot(url);
        s.setDescription(req.description().trim());
        soumissions.save(s);
        return CompetitionDto.depuis(c, true, s.getScore(), statut(c));
    }

    @Transactional(readOnly = true)
    public List<SoumissionCompetitionDto> soumissionsAdmin(Long competitionId) {
        trouverCompetition(competitionId);
        List<SoumissionCompetition> classement =
                soumissions.findByCompetitionIdOrderByScoreDescDateSoumissionAsc(competitionId);
        if (c.getType() == com.cadev.backend.enumeration.TypeCompetition.SOLO) {
            for (int i = 0; i < Math.min(3, classement.size()); i++) {
                badgeService.attribuerBadgePodium(classement.get(i).getUtilisateur().getId(), i + 1);
            }
        }
        return classement.stream().map(SoumissionCompetitionDto::depuis).toList();
    }

    @Transactional
    public SoumissionCompetitionDto evaluer(Long competitionId, Long soumissionId, EvaluationCompetitionRequete req) {
        Competition c = trouverCompetition(competitionId);
        if (req.score() > c.getPointsMaximum())
            throw new RequeteInvalideException("Le score ne peut pas dépasser " + c.getPointsMaximum() + " points.");
        SoumissionCompetition s = soumissions.findById(soumissionId)
                .filter(x -> x.getCompetition().getId().equals(competitionId))
                .orElseThrow(() -> new RessourceIntrouvableException("Soumission introuvable."));
        s.setScore(req.score());
        s.setRetourEvaluation(req.retourEvaluation() == null ? null : req.retourEvaluation().trim());
        return SoumissionCompetitionDto.depuis(s);
    }

    @Transactional
    public List<SoumissionCompetitionDto> classement(Long competitionId) {
        Competition c = trouverCompetition(competitionId);
        if (LocalDateTime.now(FUSEAU).isBefore(c.getDateFin()))
            throw new ConflitException("Le classement sera publié à la clôture de la compétition.");
        return soumissions.findByCompetitionIdOrderByScoreDescDateSoumissionAsc(competitionId)
                .stream().map(SoumissionCompetitionDto::depuis).toList();
    }

    private Competition trouverCompetition(Long id) {
        return competitions.findById(id).filter(Competition::isPubliee)
                .orElseThrow(() -> new RessourceIntrouvableException("Compétition introuvable."));
    }
    private String statut(Competition c) {
        LocalDateTime maintenant = LocalDateTime.now(FUSEAU);
        if (maintenant.isBefore(c.getDateDebut())) return "A_VENIR";
        if (!maintenant.isBefore(c.getDateFin())) return "TERMINEE";
        return "EN_COURS";
    }
    private Utilisateur utilisateur(String email) {
        return utilisateurs.findByEmail(email).orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable."));
    }
}
