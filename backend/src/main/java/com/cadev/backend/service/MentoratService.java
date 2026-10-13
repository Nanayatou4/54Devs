package com.cadev.backend.service;

import com.cadev.backend.dto.entree.*;
import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.entite.Mentorat;
import com.cadev.backend.entite.ProfilMentor;
import com.cadev.backend.entite.SeanceMentorat;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.RoleMentorat;
import com.cadev.backend.enumeration.StatutMentorat;
import com.cadev.backend.enumeration.StatutSeance;
import com.cadev.backend.exception.ActionInterditeException;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.MentoratRepository;
import com.cadev.backend.repository.ProfilMentorRepository;
import com.cadev.backend.repository.SeanceMentoratRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentoratService {

    private static final ZoneId FUSEAU = ZoneId.of("Africa/Dakar");

    private final MentoratRepository mentorats;
    private final SeanceMentoratRepository seances;
    private final ProfilMentorRepository profilsMentor;
    private final UtilisateurRepository utilisateurs;
    private final BadgeService badges;

    // ---------- Demande et décision ----------

    @Transactional
    public MentoratDto demander(String email, DemandeMentoratRequete req) {
        Utilisateur moi = trouverUtilisateur(email);
        if (req.mentorId().equals(moi.getId())) {
            throw new RequeteInvalideException("Vous ne pouvez pas vous demander à vous-même");
        }
        ProfilMentor pm = profilsMentor.findByUtilisateurId(req.mentorId())
                .filter(m -> m.isActif() && m.getUtilisateur().isActif())
                .orElseThrow(() -> new RessourceIntrouvableException("Ce mentor est introuvable"));

        if (mentorats.existsByMentorIdAndMentoreIdAndStatutIn(req.mentorId(), moi.getId(),
                List.of(StatutMentorat.EN_ATTENTE, StatutMentorat.ACCEPTE))) {
            throw new ConflitException("Vous avez déjà une demande en attente ou un mentorat en cours avec ce mentor");
        }
        long enCours = mentorats.countByMentorIdAndStatut(req.mentorId(), StatutMentorat.ACCEPTE);
        if (MentorService.placesRestantes(pm, enCours) == 0) {
            throw new ConflitException("Ce mentor n'a plus de place");
        }

        Mentorat m = new Mentorat();
        m.setMentor(pm.getUtilisateur());
        m.setMentore(moi);
        m.setSujet(req.sujet());
        m.setMessage(req.message());
        mentorats.save(m);
        return resume(m);
    }

    @Transactional
    public MentoratDto decider(Long id, String email, StatutMentorat decision) {
        if (decision != StatutMentorat.ACCEPTE && decision != StatutMentorat.REFUSE) {
            throw new RequeteInvalideException("La décision doit être ACCEPTE ou REFUSE");
        }
        Mentorat m = trouverMentorat(id);
        Utilisateur moi = trouverUtilisateur(email);
        verifierMentor(m, moi);
        if (m.getStatut() != StatutMentorat.EN_ATTENTE) {
            throw new ConflitException("Cette demande a déjà été traitée");
        }

        if (decision == StatutMentorat.ACCEPTE) {
            // Verrou sur le profil du mentor : le nombre de places est vérifié sans risque de dépassement
            ProfilMentor pm = profilsMentor.findPourMiseAJour(moi.getId())
                    .orElseThrow(() -> new ConflitException("Vous n'avez pas de profil de mentor"));
            long enCours = mentorats.countByMentorIdAndStatut(moi.getId(), StatutMentorat.ACCEPTE);
            if (MentorService.placesRestantes(pm, enCours) == 0) {
                throw new ConflitException("Vous avez atteint votre nombre maximum de personnes accompagnées");
            }
            m.setDateDebut(LocalDateTime.now(FUSEAU));
        }
        m.setStatut(decision);
        return resume(m);
    }

    // ---------- Lecture ----------

    @Transactional(readOnly = true)
    public MesMentoratsDto mesMentorats(String email) {
        Utilisateur moi = trouverUtilisateur(email);
        return new MesMentoratsDto(
                mentorats.findCommeMentor(moi.getId()).stream().map(this::resume).toList(),
                mentorats.findCommeMentore(moi.getId()).stream().map(this::resume).toList());
    }

    @Transactional(readOnly = true)
    public MentoratDetailDto detail(Long id, String email) {
        Mentorat m = trouverMentorat(id);
        RoleMentorat role = roleDe(m, trouverUtilisateur(email));
        List<SeanceDto> liste = seances.findByMentoratIdOrderByDateDesc(id).stream().map(SeanceDto::depuis).toList();
        return new MentoratDetailDto(resume(m), role, liste, m.getBilanMentor(), m.getBilanMentore());
    }

    // ---------- Séances ----------

    @Transactional
    public SeanceDto planifier(Long id, String email, SeanceRequete req) {
        Mentorat m = trouverMentorat(id);
        verifierMentor(m, trouverUtilisateur(email));
        if (m.getStatut() != StatutMentorat.ACCEPTE) {
            throw new ConflitException("On ne peut planifier une séance que dans un mentorat en cours");
        }
        if (!req.date().isAfter(LocalDateTime.now(FUSEAU))) {
            throw new RequeteInvalideException("La date de la séance doit être dans le futur");
        }
        SeanceMentorat s = new SeanceMentorat();
        s.setMentorat(m);
        s.setDate(req.date());
        s.setDureeMinutes(req.dureeMinutes());
        s.setSujet(req.sujet());
        seances.save(s);
        return SeanceDto.depuis(s);
    }

    @Transactional
    public SeanceDto compteRendu(Long id, Long seanceId, String email, CompteRenduRequete req) {
        Mentorat m = trouverMentorat(id);
        verifierMentor(m, trouverUtilisateur(email));
        if (m.getStatut() != StatutMentorat.ACCEPTE && m.getStatut() != StatutMentorat.TERMINE) {
            throw new ConflitException("Ce mentorat n'a pas commencé");
        }
        SeanceMentorat s = seances.findById(seanceId)
                .filter(x -> x.getMentorat().getId().equals(id))
                .orElseThrow(() -> new RessourceIntrouvableException("Séance introuvable"));

        s.setCompteRendu(req.compteRendu().trim());
        s.setStatut(StatutSeance.REALISEE);
        badges.evaluer(m.getMentor().getId()); // le badge Mentor récompense les séances animées
        return SeanceDto.depuis(s);
    }

    // ---------- Fin et bilan ----------

    @Transactional
    public MentoratDto terminer(Long id, String email, TerminerRequete req) {
        Mentorat m = trouverMentorat(id);
        RoleMentorat role = roleDe(m, trouverUtilisateur(email));
        if (m.getStatut() != StatutMentorat.ACCEPTE) {
            throw new ConflitException("Seul un mentorat en cours peut être terminé");
        }
        m.setStatut(StatutMentorat.TERMINE);
        m.setDateFin(LocalDateTime.now(FUSEAU));
        if (req != null && req.bilan() != null && !req.bilan().isBlank()) {
            ecrireBilan(m, role, req.bilan().trim());
        }
        badges.evaluer(m.getMentor().getId());
        return resume(m);
    }

    @Transactional
    public MentoratDto bilan(Long id, String email, BilanRequete req) {
        Mentorat m = trouverMentorat(id);
        RoleMentorat role = roleDe(m, trouverUtilisateur(email));
        if (m.getStatut() != StatutMentorat.TERMINE) {
            throw new ConflitException("Le bilan s'écrit une fois le mentorat terminé");
        }
        ecrireBilan(m, role, req.bilan().trim());
        return resume(m);
    }

    // ---------- Méthodes privées ----------

    private void ecrireBilan(Mentorat m, RoleMentorat role, String bilan) {
        if (role == RoleMentorat.MENTOR) {
            m.setBilanMentor(bilan);
        } else {
            m.setBilanMentore(bilan);
        }
    }

    private RoleMentorat roleDe(Mentorat m, Utilisateur moi) {
        if (m.getMentor().getId().equals(moi.getId())) {
            return RoleMentorat.MENTOR;
        }
        if (m.getMentore().getId().equals(moi.getId())) {
            return RoleMentorat.MENTORE;
        }
        throw new ActionInterditeException("Ce mentorat ne vous concerne pas");
    }

    private void verifierMentor(Mentorat m, Utilisateur moi) {
        if (!m.getMentor().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul le mentor peut faire cette action");
        }
    }

    private MentoratDto resume(Mentorat m) {
        List<SeanceMentorat> liste = seances.findByMentoratIdOrderByDateDesc(m.getId());
        long realisees = liste.stream().filter(s -> s.getStatut() == StatutSeance.REALISEE).count();
        return new MentoratDto(m.getId(), UtilisateurResumeDto.depuis(m.getMentor()),
                UtilisateurResumeDto.depuis(m.getMentore()), m.getSujet(), m.getMessage(), m.getStatut(),
                m.getDateDemande(), m.getDateDebut(), m.getDateFin(),
                (int) realisees, (int) (liste.size() - realisees));
    }

    private Mentorat trouverMentorat(Long id) {
        return mentorats.findAvecParticipants(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Mentorat introuvable"));
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }
}