package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.MonProjetDto;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.dto.sortie.ProjetResumeDto;
import com.cadev.backend.dto.sortie.UtilisateurResumeDto;
import com.cadev.backend.entite.MembreProjet;
import com.cadev.backend.entite.Projet;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.RoleMembre;
import com.cadev.backend.enumeration.StatutDemande;
import com.cadev.backend.enumeration.StatutProjet;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.DemandeAdhesionRepository;
import com.cadev.backend.repository.MembreProjetRepository;
import com.cadev.backend.repository.ProjetRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.specifications.ProjetSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RechercheProjetService {

    private static final int TAILLE_MAX = 50;

    private final ProjetRepository projets;
    private final UtilisateurRepository utilisateurs;
    private final MembreProjetRepository membres;
    private final DemandeAdhesionRepository demandes;

    @Transactional(readOnly = true)
    public PageDto<ProjetResumeDto> rechercher(String texte, String technologie, String categorie,
                                               StatutProjet statut, Long competenceId, int page, int taille) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX),
                Sort.by(Sort.Direction.DESC, "dateCreation"));

        Page<Projet> resultat = projets.findAll(
                ProjetSpecifications.filtres(texte, technologie, categorie, statut, competenceId), pageable);

        Map<Long, Long> nombreMembres = compterMembres(resultat.getContent());
        List<ProjetResumeDto> contenu = resultat.getContent().stream()
                .map(p -> resume(p, nombreMembres.getOrDefault(p.getId(), 0L)))
                .toList();
        return PageDto.depuis(resultat, contenu);
    }

    @Transactional(readOnly = true)
    public List<MonProjetDto> mesProjets(String email) {
        Utilisateur moi = utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));

        List<MembreProjet> mesAdhesions = membres.findMesProjets(moi.getId());
        Map<Long, Long> nombreMembres = compterMembres(
                mesAdhesions.stream().map(MembreProjet::getProjet).toList());

        return mesAdhesions.stream().map(m -> {
            Projet p = m.getProjet();
            ProjetResumeDto r = resume(p, nombreMembres.getOrDefault(p.getId(), 0L));
            int enAttente = m.getRole() == RoleMembre.CREATEUR
                    ? (int) demandes.countByProjetIdAndStatut(p.getId(), StatutDemande.EN_ATTENTE)
                    : 0;
            return new MonProjetDto(r.id(), r.nom(), r.description(), r.categorie(), r.technologies(),
                    r.imageUrl(),
                    r.statut(), r.placesRestantes(), r.ouvertAuxDemandes(), r.nombreMembres(),
                    r.createur(), r.competencesRecherchees(), m.getRole(), enAttente);
        }).toList();
    }

    public Map<Long, Long> compterMembres(List<Projet> liste) {
        if (liste.isEmpty()) {
            return Map.of();
        }
        List<Long> ids = liste.stream().map(Projet::getId).toList();
        Map<Long, Long> resultat = new HashMap<>();
        for (Object[] ligne : membres.compterParProjet(ids)) {
            resultat.put(((Number) ligne[0]).longValue(), ((Number) ligne[1]).longValue());
        }
        return resultat;
    }

    public ProjetResumeDto resume(Projet p, long nombreMembres) {
        int places = ProjetService.calculerPlacesRestantes(p, nombreMembres);
        String description = p.getDescription().length() > 200
                ? p.getDescription().substring(0, 200) + "…"
                : p.getDescription();
        return new ProjetResumeDto(
                p.getId(), p.getNom(), description, p.getCategorie(), p.getTechnologies(), p.getImageUrl(), p.getStatut(),
                places, ProjetService.estOuvertAuxDemandes(p, places), (int) nombreMembres,
                UtilisateurResumeDto.depuis(p.getCreateur()),
                p.getCompetencesRecherchees().stream().map(cp -> cp.getCompetence().getNom()).toList());
    }
}
