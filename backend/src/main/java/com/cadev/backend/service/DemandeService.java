package com.cadev.backend.service;

import com.cadev.backend.dto.entree.DemandeRequete;
import com.cadev.backend.dto.sortie.CompetenceUtilisateurDto;
import com.cadev.backend.dto.sortie.DemandeDto;
import com.cadev.backend.dto.sortie.DemandeRecueDto;
import com.cadev.backend.dto.sortie.UtilisateurResumeDto;
import com.cadev.backend.entite.DemandeAdhesion;
import com.cadev.backend.entite.MembreProjet;
import com.cadev.backend.entite.Projet;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.RoleMembre;
import com.cadev.backend.enumeration.StatutDemande;
import com.cadev.backend.enumeration.StatutProjet;
import com.cadev.backend.exception.ActionInterditeException;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DemandeService {

    private final ProjetRepository projets;
    private final UtilisateurRepository utilisateurs;
    private final MembreProjetRepository membres;
    private final DemandeAdhesionRepository demandes;
    private final CompetenceUtilisateurRepository competencesUtilisateur;
    private final LimiteProjetsService limite;

    @Transactional
    public DemandeDto envoyer(Long projetId, String email, DemandeRequete req) {
        Projet p = trouverProjet(projetId);
        Utilisateur moi = trouverUtilisateur(email);

        if (req == null || !Boolean.TRUE.equals(req.engagementAccepte())) {
            throw new RequeteInvalideException(
                    "Vous devez accepter l'engagement pour demander à rejoindre le projet");
        }
        if (membres.existsByProjetIdAndUtilisateurId(projetId, moi.getId())) {
            throw new ConflitException("Vous êtes déjà membre de ce projet");
        }
        if (demandes.existsByProjetIdAndDemandeurIdAndStatut(projetId, moi.getId(), StatutDemande.EN_ATTENTE)) {
            throw new ConflitException("Vous avez déjà une demande en attente pour ce projet");
        }
        if (p.getStatut() == StatutProjet.TERMINE) {
            throw new ConflitException("Ce projet est terminé");
        }
        if (ProjetService.calculerPlacesRestantes(p, membres.countByProjetId(projetId)) == 0) {
            throw new ConflitException("Ce projet est complet");
        }

        limite.verifier(moi, true);

        DemandeAdhesion d = new DemandeAdhesion();
        d.setProjet(p);
        d.setDemandeur(moi);
        d.setMessage(req.message());
        d.setEngagementAccepteLe(LocalDateTime.now());
        demandes.save(d);
        return DemandeDto.depuis(d);
    }

    @Transactional(readOnly = true)
    public List<DemandeRecueDto> lister(Long projetId, String email, StatutDemande statut) {
        Projet p = trouverProjet(projetId);
        verifierCreateur(p, trouverUtilisateur(email));

        List<DemandeAdhesion> liste = (statut == null)
                ? demandes.findPourProjet(projetId)
                : demandes.findPourProjetParStatut(projetId, statut);

        return liste.stream().map(d -> new DemandeRecueDto(
                d.getId(), d.getMessage(), d.getStatut(), d.getDateDemande(),
                UtilisateurResumeDto.depuis(d.getDemandeur()),
                competencesUtilisateur.findAvecCompetence(d.getDemandeur().getId()).stream()
                        .map(CompetenceUtilisateurDto::depuis).toList()
        )).toList();
    }

    @Transactional
    public DemandeDto decider(Long projetId, Long demandeId, String email, StatutDemande decision) {
        if (decision != StatutDemande.ACCEPTEE && decision != StatutDemande.REFUSEE) {
            throw new RequeteInvalideException("La décision doit être ACCEPTEE ou REFUSEE");
        }

        // Verrou : deux acceptations en même temps ne peuvent pas dépasser le nombre de places
        Projet p = projets.findByIdPourMiseAJour(projetId)
                .orElseThrow(() -> new RessourceIntrouvableException("Projet introuvable"));
        verifierCreateur(p, trouverUtilisateur(email));

        DemandeAdhesion d = demandes.findById(demandeId)
                .filter(x -> x.getProjet().getId().equals(projetId))
                .orElseThrow(() -> new RessourceIntrouvableException("Demande introuvable"));

        if (d.getStatut() != StatutDemande.EN_ATTENTE) {
            throw new ConflitException("Cette demande a déjà été traitée");
        }

        if (decision == StatutDemande.ACCEPTEE) {
            if (p.getStatut() == StatutProjet.TERMINE) {
                throw new ConflitException("Ce projet est terminé");
            }
            if (ProjetService.calculerPlacesRestantes(p, membres.countByProjetId(projetId)) == 0) {
                throw new ConflitException("Ce projet est complet");
            }
            if (membres.existsByProjetIdAndUtilisateurId(projetId, d.getDemandeur().getId())) {
                throw new ConflitException("Cette personne est déjà membre du projet");
            }
            limite.verifier(d.getDemandeur(), false);
            MembreProjet m = new MembreProjet();
            m.setProjet(p);
            m.setUtilisateur(d.getDemandeur());
            m.setRole(RoleMembre.MEMBRE);
            membres.save(m);
        }

        d.setStatut(decision);
        return DemandeDto.depuis(d);
    }

    @Transactional(readOnly = true)
    public List<DemandeDto> mesDemandes(String email) {
        Utilisateur moi = trouverUtilisateur(email);
        return demandes.findMesDemandes(moi.getId()).stream().map(DemandeDto::depuis).toList();
    }

    private void verifierCreateur(Projet p, Utilisateur moi) {
        if (!p.getCreateur().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul le créateur du projet peut faire cette action");
        }
    }

    private Projet trouverProjet(Long id) {
        return projets.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Projet introuvable"));
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }
}
