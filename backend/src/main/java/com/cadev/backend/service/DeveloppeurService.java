package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.entite.CompetenceUtilisateur;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.Role;
import com.cadev.backend.enumeration.TypeCompetence;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.CompetenceUtilisateurRepository;
import com.cadev.backend.repository.MembreProjetRepository;
import com.cadev.backend.repository.ProfilRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.specifications.DeveloppeurSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeveloppeurService {

    private static final int TAILLE_MAX = 50;

    private final ProfilRepository profils;
    private final UtilisateurRepository utilisateurs;
    private final CompetenceUtilisateurRepository competencesUtilisateur;
    private final MembreProjetRepository membres;
    private final BadgeService badges;

    public DeveloppeurResumeDto resume(Profil p, List<CompetenceUtilisateur> comps) {
        Utilisateur u = p.getUtilisateur();
        return new DeveloppeurResumeDto(u.getId(), u.getPrenom(), u.getNom(), p.getPseudo(),
                p.getPays(), p.getVille(), p.getNiveau(), p.getDisponibilite(), extrait(p.getBio()),
                noms(comps, TypeCompetence.MAITRISE),
                noms(comps, TypeCompetence.ENSEIGNER),
                noms(comps, TypeCompetence.APPRENDRE),
                p.getAvatarUrl());
    }

    @Transactional(readOnly = true)
    public PageDto<DeveloppeurResumeDto> rechercher(String email, String texte, Long competenceId,
                                                    TypeCompetence type, String pays, Niveau niveau,
                                                    String disponibilite, int page, int taille) {
        Long moiId = null;
        if (email != null && !email.isBlank()) {
            moiId = utilisateurs.findByEmail(email).map(Utilisateur::getId).orElse(null);
        }

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX),
                Sort.by("pseudo").ascending());
        Page<Profil> resultat = profils.findAll(
                DeveloppeurSpecifications.filtres(moiId, texte, competenceId, type, pays, niveau, disponibilite),
                pageable);

        List<Long> ids = resultat.getContent().stream().map(p -> p.getUtilisateur().getId()).toList();
        Map<Long, List<CompetenceUtilisateur>> competencesParId = ids.isEmpty()
                ? Map.of()
                : competencesUtilisateur.findParUtilisateurs(ids).stream()
                .collect(Collectors.groupingBy(cu -> cu.getUtilisateur().getId()));

        List<DeveloppeurResumeDto> contenu = resultat.getContent().stream().map(p -> {
            List<CompetenceUtilisateur> comps = competencesParId.getOrDefault(p.getUtilisateur().getId(), List.of());
            return resume(p, comps);
        }).toList();
        return PageDto.depuis(resultat, contenu);
    }

    @Transactional(readOnly = true)
    public DeveloppeurDetailDto detail(Long utilisateurId) {
        Profil p = profils.findByUtilisateurId(utilisateurId)
                .filter(x -> x.getUtilisateur().isActif() && x.getUtilisateur().getRole() != Role.ADMIN)
                .orElseThrow(() -> new RessourceIntrouvableException("Développeur introuvable"));
        Utilisateur u = p.getUtilisateur();

        List<CompetenceUtilisateurDto> competences = competencesUtilisateur.findAvecCompetence(utilisateurId)
                .stream().map(CompetenceUtilisateurDto::depuis).toList();
        List<ProjetDeDeveloppeurDto> projets = membres.findMesProjets(utilisateurId).stream()
                .map(m -> new ProjetDeDeveloppeurDto(m.getProjet().getId(), m.getProjet().getNom(),
                        m.getProjet().getStatut(), m.getRole()))
                .toList();

        return new DeveloppeurDetailDto(u.getId(), u.getPrenom(), u.getNom(), p.getPseudo(),
                p.getPays(), p.getVille(), p.getNiveau(), p.getDisponibilite(), p.getBio(),
                p.getGithub(), p.getLinkedin(), p.getPortfolio(), competences, projets, badges.badgesObtenus(utilisateurId),
                p.getAvatarUrl());
    }

    private static List<String> noms(List<CompetenceUtilisateur> liste, TypeCompetence type) {
        return liste.stream()
                .filter(cu -> cu.getType() == type)
                .map(cu -> cu.getCompetence().getNom())
                .distinct().sorted().toList();
    }

    private static String extrait(String bio) {
        if (bio == null) {
            return null;
        }
        return bio.length() > 150 ? bio.substring(0, 150) + "…" : bio;
    }
}
