package com.cadev.backend.service;

import com.cadev.backend.dto.entree.DiscussionRequete;
import com.cadev.backend.dto.sortie.DiscussionDto;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.entite.DiscussionProjet;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.exception.ActionInterditeException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.DiscussionProjetRepository;
import com.cadev.backend.repository.MembreProjetRepository;
import com.cadev.backend.repository.ProjetRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private static final int TAILLE_MAX = 100;

    private final ProjetRepository projets;
    private final UtilisateurRepository utilisateurs;
    private final MembreProjetRepository membres;
    private final DiscussionProjetRepository discussions;

    @Transactional(readOnly = true)
    public PageDto<DiscussionDto> lire(Long projetId, String email, int page, int taille) {
        verifierMembre(projetId, email);
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(taille, 1), TAILLE_MAX),
                Sort.by(Sort.Direction.ASC, "dateCreation"));
        Page<DiscussionProjet> resultat = discussions.findPourProjet(projetId, pageable);
        return PageDto.depuis(resultat, resultat.getContent().stream().map(DiscussionDto::depuis).toList());
    }

    @Transactional
    public DiscussionDto ecrire(Long projetId, String email, DiscussionRequete req) {
        Utilisateur moi = verifierMembre(projetId, email);
        DiscussionProjet d = new DiscussionProjet();
        d.setProjet(projets.getReferenceById(projetId));
        d.setAuteur(moi);
        d.setContenu(req.contenu().trim());
        discussions.save(d);
        return DiscussionDto.depuis(d);
    }

    /** L'espace du projet est réservé aux membres. Retourne l'utilisateur connecté. */
    private Utilisateur verifierMembre(Long projetId, String email) {
        if (!projets.existsById(projetId)) {
            throw new RessourceIntrouvableException("Projet introuvable");
        }
        Utilisateur moi = utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
        if (!membres.existsByProjetIdAndUtilisateurId(projetId, moi.getId())) {
            throw new ActionInterditeException("Cet espace est réservé aux membres du projet");
        }
        return moi;
    }
}
