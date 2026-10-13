package com.cadev.backend.service;

import com.cadev.backend.dto.entree.ProfilMentorRequete;
import com.cadev.backend.dto.sortie.MentorDetailDto;
import com.cadev.backend.dto.sortie.MentorResumeDto;
import com.cadev.backend.dto.sortie.MonProfilMentorDto;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.entite.CompetenceUtilisateur;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.ProfilMentor;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.StatutMentorat;
import com.cadev.backend.enumeration.TypeCompetence;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.*;
import com.cadev.backend.service.specifications.MentorSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorService {

    private static final int TAILLE_MAX = 50;

    private final ProfilMentorRepository profilsMentor;
    private final UtilisateurRepository utilisateurs;
    private final ProfilRepository profils;
    private final CompetenceUtilisateurRepository competencesUtilisateur;
    private final MentoratRepository mentorats;
    private final DeveloppeurService developpeurs;

    public static int placesRestantes(ProfilMentor pm, long mentoratsEnCours) {
        return (int) Math.max(0, pm.getNombreMentoresMax() - mentoratsEnCours);
    }

    @Transactional(readOnly = true)
    public MonProfilMentorDto monProfil(String email) {
        Utilisateur moi = trouverUtilisateur(email);
        ProfilMentor pm = profilsMentor.findByUtilisateurId(moi.getId()).orElse(null);
        if (pm == null) {
            return new MonProfilMentorDto(false, null, 0, false, 0);
        }
        long enCours = mentorats.countByMentorIdAndStatut(moi.getId(), StatutMentorat.ACCEPTE);
        return new MonProfilMentorDto(true, pm.getPresentation(), pm.getNombreMentoresMax(),
                pm.isActif(), placesRestantes(pm, enCours));
    }

    @Transactional
    public MonProfilMentorDto enregistrerProfil(String email, ProfilMentorRequete req) {
        Utilisateur moi = trouverUtilisateur(email);
        boolean actif = req.actif() == null || req.actif();

        if (actif) {
            boolean peutEnseigner = competencesUtilisateur.findAvecCompetence(moi.getId()).stream()
                    .anyMatch(cu -> cu.getType() == TypeCompetence.ENSEIGNER);
            if (!peutEnseigner) {
                throw new RequeteInvalideException(
                        "Déclarez au moins une compétence « Je peux enseigner » dans votre profil pour devenir mentor");
            }
        }
        long enCours = mentorats.countByMentorIdAndStatut(moi.getId(), StatutMentorat.ACCEPTE);
        if (req.nombreMentoresMax() < enCours) {
            throw new ConflitException("Vous accompagnez déjà " + enCours
                    + " personne(s) : le maximum ne peut pas être inférieur");
        }

        ProfilMentor pm = profilsMentor.findByUtilisateurId(moi.getId()).orElseGet(() -> {
            ProfilMentor nouveau = new ProfilMentor();
            nouveau.setUtilisateur(moi);
            return nouveau;
        });
        pm.setPresentation(req.presentation().trim());
        pm.setNombreMentoresMax(req.nombreMentoresMax());
        pm.setActif(actif);
        profilsMentor.save(pm);

        return new MonProfilMentorDto(true, pm.getPresentation(), pm.getNombreMentoresMax(),
                pm.isActif(), placesRestantes(pm, enCours));
    }

    @Transactional(readOnly = true)
    public PageDto<MentorResumeDto> rechercher(String email, String texte, Long competenceId, String pays,
                                               Niveau niveau, int page, int taille) {
        Utilisateur moi = trouverUtilisateur(email);
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX),
                Sort.by(Sort.Direction.DESC, "dateCreation"));
        Page<ProfilMentor> resultat = profilsMentor.findAll(
                MentorSpecifications.filtres(moi.getId(), texte, competenceId, pays, niveau), pageable);

        List<Long> ids = resultat.getContent().stream().map(pm -> pm.getUtilisateur().getId()).toList();
        Map<Long, List<CompetenceUtilisateur>> competences = ids.isEmpty()
                ? Map.of()
                : competencesUtilisateur.findParUtilisateurs(ids).stream()
                .collect(Collectors.groupingBy(cu -> cu.getUtilisateur().getId()));
        Map<Long, Long> enCours = compterEnCours(ids);

        List<MentorResumeDto> contenu = new ArrayList<>();
        for (ProfilMentor pm : resultat.getContent()) {
            Long id = pm.getUtilisateur().getId();
            Profil profil = profils.findByUtilisateurId(id).orElse(null);
            if (profil == null) {
                continue;
            }
            contenu.add(new MentorResumeDto(
                    developpeurs.resume(profil, competences.getOrDefault(id, List.of())),
                    pm.getPresentation(), pm.getNombreMentoresMax(),
                    placesRestantes(pm, enCours.getOrDefault(id, 0L))));
        }
        return PageDto.depuis(resultat, contenu);
    }

    @Transactional(readOnly = true)
    public MentorDetailDto detail(Long utilisateurId) {
        ProfilMentor pm = profilsMentor.findByUtilisateurId(utilisateurId)
                .filter(m -> m.isActif() && m.getUtilisateur().isActif())
                .orElseThrow(() -> new RessourceIntrouvableException("Mentor introuvable"));
        Profil profil = profils.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new RessourceIntrouvableException("Mentor introuvable"));
        List<CompetenceUtilisateur> competences = competencesUtilisateur.findParUtilisateurs(List.of(utilisateurId));
        long enCours = mentorats.countByMentorIdAndStatut(utilisateurId, StatutMentorat.ACCEPTE);
        long termines = mentorats.countByMentorIdAndStatut(utilisateurId, StatutMentorat.TERMINE);
        return new MentorDetailDto(developpeurs.resume(profil, competences), pm.getPresentation(),
                pm.getNombreMentoresMax(), placesRestantes(pm, enCours), termines);
    }

    private Map<Long, Long> compterEnCours(List<Long> ids) {
        Map<Long, Long> resultat = new HashMap<>();
        if (ids.isEmpty()) {
            return resultat;
        }
        for (Object[] ligne : mentorats.compterActifsParMentor(ids)) {
            resultat.put(((Number) ligne[0]).longValue(), ((Number) ligne[1]).longValue());
        }
        return resultat;
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }
}