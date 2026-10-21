package com.cadev.backend.service;

import com.cadev.backend.dto.entree.DecisionInvitationRequete;
import com.cadev.backend.dto.entree.InvitationRequete;
import com.cadev.backend.dto.sortie.InvitationEnvoyeeDto;
import com.cadev.backend.dto.sortie.InvitationRecueDto;
import com.cadev.backend.dto.sortie.MaInvitationDto;
import com.cadev.backend.dto.sortie.UtilisateurResumeDto;
import com.cadev.backend.entite.InvitationProjet;
import com.cadev.backend.entite.MembreProjet;
import com.cadev.backend.entite.Projet;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.RoleMembre;
import com.cadev.backend.enumeration.StatutDemande;
import com.cadev.backend.enumeration.StatutInvitation;
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
public class InvitationService {

    private static final int INVITATIONS_EN_ATTENTE_MAX = 10;

    private final InvitationProjetRepository invitations;
    private final ProjetRepository projets;
    private final UtilisateurRepository utilisateurs;
    private final MembreProjetRepository membres;
    private final DemandeAdhesionRepository demandes;
    private final LimiteProjetsService limite;
    private final BadgeService badges;

    // ---------- Côté créateur ----------

    @Transactional
    public InvitationEnvoyeeDto inviter(Long projetId, String email, InvitationRequete req) {
        Projet p = trouverProjet(projetId);
        Utilisateur moi = trouverUtilisateur(email);
        verifierCreateur(p, moi);

        if (req.utilisateurId().equals(moi.getId())) {
            throw new RequeteInvalideException("Vous ne pouvez pas vous inviter vous-même");
        }
        Utilisateur invite = utilisateurs.findById(req.utilisateurId())
                .filter(Utilisateur::isActif)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));

        long nombreMembres = membres.countByProjetId(projetId);
        int places = ProjetService.calculerPlacesRestantes(p, nombreMembres);
        if (!ProjetService.estOuvertAuxDemandes(p, places)) {
            throw new ConflitException("Ce projet est terminé ou complet : impossible d'inviter");
        }
        if (membres.existsByProjetIdAndUtilisateurId(projetId, invite.getId())) {
            throw new ConflitException("Cette personne est déjà membre du projet");
        }
        if (invitations.existsByProjetIdAndInviteIdAndStatut(projetId, invite.getId(), StatutInvitation.EN_ATTENTE)) {
            throw new ConflitException("Une invitation est déjà en attente pour cette personne");
        }
        if (demandes.existsByProjetIdAndDemandeurIdAndStatut(projetId, invite.getId(), StatutDemande.EN_ATTENTE)) {
            throw new ConflitException("Cette personne a déjà demandé à rejoindre le projet : acceptez sa demande");
        }
        if (invitations.countByProjetIdAndStatut(projetId, StatutInvitation.EN_ATTENTE) >= INVITATIONS_EN_ATTENTE_MAX) {
            throw new ConflitException("Ce projet a déjà " + INVITATIONS_EN_ATTENTE_MAX
                    + " invitations en attente : attendez des réponses ou annulez-en");
        }
        limite.verifier(invite, false); // évite d'envoyer une invitation qui ne pourra jamais être acceptée

        InvitationProjet i = new InvitationProjet();
        i.setProjet(p);
        i.setInvite(invite);
        i.setMessage(req.message());
        invitations.save(i);
        return InvitationEnvoyeeDto.depuis(i);
    }

    @Transactional(readOnly = true)
    public List<InvitationEnvoyeeDto> envoyees(Long projetId, String email, StatutInvitation statut) {
        Projet p = trouverProjet(projetId);
        verifierCreateur(p, trouverUtilisateur(email));
        return invitations.findEnvoyees(projetId).stream()
                .filter(i -> statut == null || i.getStatut() == statut)
                .map(InvitationEnvoyeeDto::depuis)
                .toList();
    }

    @Transactional
    public void annuler(Long projetId, Long invitationId, String email) {
        Projet p = trouverProjet(projetId);
        verifierCreateur(p, trouverUtilisateur(email));
        InvitationProjet i = invitations.findAvecDetails(invitationId)
                .filter(x -> x.getProjet().getId().equals(projetId))
                .orElseThrow(() -> new RessourceIntrouvableException("Invitation introuvable"));
        if (i.getStatut() != StatutInvitation.EN_ATTENTE) {
            throw new ConflitException("Seule une invitation en attente peut être annulée");
        }
        i.setStatut(StatutInvitation.ANNULEE);
        i.setDateReponse(LocalDateTime.now());
    }

    // ---------- Côté invité ----------

    @Transactional(readOnly = true)
    public List<InvitationRecueDto> mesInvitations(String email, StatutInvitation statut) {
        Utilisateur moi = trouverUtilisateur(email);
        return invitations.findRecues(moi.getId()).stream()
                .filter(i -> statut == null || i.getStatut() == statut)
                .map(this::versDtoRecu)
                .toList();
    }

    @Transactional
    public InvitationRecueDto repondre(Long id, String email, DecisionInvitationRequete req) {
        if (req.decision() != StatutInvitation.ACCEPTEE && req.decision() != StatutInvitation.REFUSEE) {
            throw new RequeteInvalideException("La décision doit être ACCEPTEE ou REFUSEE");
        }
        Utilisateur moi = trouverUtilisateur(email);
        InvitationProjet i = invitations.findAvecDetails(id)
                .filter(x -> x.getInvite().getId().equals(moi.getId())) // une invitation qui ne vous concerne pas « n'existe pas »
                .orElseThrow(() -> new RessourceIntrouvableException("Invitation introuvable"));
        if (i.getStatut() != StatutInvitation.EN_ATTENTE) {
            throw new ConflitException("Cette invitation a déjà reçu une réponse");
        }

        if (req.decision() == StatutInvitation.ACCEPTEE) {
            if (!Boolean.TRUE.equals(req.engagementAccepte())) {
                throw new RequeteInvalideException("Vous devez accepter l'engagement pour rejoindre le projet");
            }
            // Verrou sur le projet : les places sont vérifiées sans risque de dépassement
            Projet p = projets.findByIdPourMiseAJour(i.getProjet().getId())
                    .orElseThrow(() -> new RessourceIntrouvableException("Projet introuvable"));
            if (p.getStatut() == StatutProjet.TERMINE) {
                throw new ConflitException("Ce projet est terminé");
            }
            if (ProjetService.calculerPlacesRestantes(p, membres.countByProjetId(p.getId())) == 0) {
                throw new ConflitException("Ce projet est complet");
            }
            if (membres.existsByProjetIdAndUtilisateurId(p.getId(), moi.getId())) {
                throw new ConflitException("Vous êtes déjà membre de ce projet");
            }
            limite.verifier(moi, true);

            MembreProjet m = new MembreProjet();
            m.setProjet(p);
            m.setUtilisateur(moi);
            m.setRole(RoleMembre.MEMBRE);
            membres.save(m);

            i.setEngagementAccepteLe(LocalDateTime.now());
            badges.evaluer(moi.getId());
        }
        i.setStatut(req.decision());
        i.setDateReponse(LocalDateTime.now());
        return versDtoRecu(i);
    }

    /** Pour le détail d'un projet : mon invitation la plus récente, ou null. */
    @Transactional(readOnly = true)
    public MaInvitationDto maInvitation(Long projetId, Long utilisateurId) {
        return invitations.findFirstByProjetIdAndInviteIdOrderByDateInvitationDesc(projetId, utilisateurId)
                .map(i -> new MaInvitationDto(i.getId(), i.getStatut()))
                .orElse(null);
    }

    // ---------- Méthodes privées ----------

    private InvitationRecueDto versDtoRecu(InvitationProjet i) {
        Projet p = i.getProjet();
        int places = ProjetService.calculerPlacesRestantes(p, membres.countByProjetId(p.getId()));
        return new InvitationRecueDto(i.getId(), p.getId(), p.getNom(), p.getConditionsEngagement(),
                places, ProjetService.estOuvertAuxDemandes(p, places), UtilisateurResumeDto.depuis(p.getCreateur()),
                i.getMessage(), i.getStatut(), i.getDateInvitation());
    }

    private void verifierCreateur(Projet p, Utilisateur moi) {
        if (!p.getCreateur().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul le créateur du projet peut faire cette action");
        }
    }

    private Projet trouverProjet(Long id) {
        return projets.findById(id).orElseThrow(() -> new RessourceIntrouvableException("Projet introuvable"));
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }
}