package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.DepartDto;
import com.cadev.backend.dto.sortie.MembreDto;
import com.cadev.backend.entite.DepartProjet;
import com.cadev.backend.entite.MembreProjet;
import com.cadev.backend.entite.Projet;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.RoleMembre;
import com.cadev.backend.exception.ActionInterditeException;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.DepartProjetRepository;
import com.cadev.backend.repository.MembreProjetRepository;
import com.cadev.backend.repository.ProjetRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembreService {

    private final ProjetRepository projets;
    private final UtilisateurRepository utilisateurs;
    private final MembreProjetRepository membres;
    private final DepartProjetRepository departs;

    @Transactional(readOnly = true)
    public List<MembreDto> lister(Long projetId) {
        if (!projets.existsById(projetId)) {
            throw new RessourceIntrouvableException("Projet introuvable");
        }
        return membres.findAvecUtilisateur(projetId).stream().map(MembreDto::depuis).toList();
    }

    @Transactional
    public void retirer(Long projetId, Long utilisateurId, String email, String motif) {
        Projet p = trouverProjet(projetId);
        Utilisateur moi = trouverUtilisateur(email);

        MembreProjet cible = membres.findByProjetIdAndUtilisateurId(projetId, utilisateurId)
                .orElseThrow(() -> new RessourceIntrouvableException("Cette personne ne fait pas partie du projet"));

        if (cible.getRole() == RoleMembre.CREATEUR) {
            throw new ConflitException("Le créateur ne peut pas être retiré du projet");
        }

        boolean jeSuisCreateur = p.getCreateur().getId().equals(moi.getId());
        boolean cestMoi = moi.getId().equals(utilisateurId);
        if (!jeSuisCreateur && !cestMoi) {
            throw new ActionInterditeException("Vous ne pouvez retirer que vous-même");
        }

        DepartProjet depart = new DepartProjet();
        depart.setProjet(p);
        depart.setUtilisateur(cible.getUtilisateur());
        depart.setMotif(motif.trim());
        depart.setRetireParCreateur(!cestMoi);
        departs.save(depart);

        membres.delete(cible);
    }

    @Transactional(readOnly = true)
    public List<DepartDto> listerDeparts(Long projetId, String email) {
        Projet p = trouverProjet(projetId);
        Utilisateur moi = trouverUtilisateur(email);
        if (!p.getCreateur().getId().equals(moi.getId())) {
            throw new ActionInterditeException("Seul le créateur du projet peut consulter l'historique des départs");
        }
        return departs.findPourProjet(projetId).stream().map(DepartDto::depuis).toList();
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