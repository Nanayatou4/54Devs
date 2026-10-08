package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.*;
import com.cadev.backend.dto.sortie.*;
import com.cadev.backend.enumeration.StatutDemande;
import com.cadev.backend.enumeration.StatutProjet;
import com.cadev.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
public class ProjetController {

    private final ProjetService projetService;
    private final RechercheProjetService rechercheService;
    private final DemandeService demandeService;
    private final MembreService membreService;
    private final DiscussionService discussionService;

    // ----- Projets -----

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjetDetailDto creer(Authentication auth, @Valid @RequestBody ProjetRequete requete) {
        return projetService.creer(auth.getName(), requete);
    }

    @GetMapping
    public PageDto<ProjetResumeDto> rechercher(
            @RequestParam(required = false) String texte,
            @RequestParam(required = false) String technologie,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) StatutProjet statut,
            @RequestParam(required = false) Long competenceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int taille) {
        return rechercheService.rechercher(texte, technologie, categorie, statut, competenceId, page, taille);
    }

    @GetMapping("/mes-projets")
    public List<MonProjetDto> mesProjets(Authentication auth) {
        return rechercheService.mesProjets(auth.getName());
    }

    @GetMapping("/{id}")
    public ProjetDetailDto detail(Authentication auth, @PathVariable Long id) {
        return projetService.detail(id, auth.getName());
    }

    @PutMapping("/{id}")
    public ProjetDetailDto modifier(Authentication auth, @PathVariable Long id,
                                    @Valid @RequestBody ProjetRequete requete) {
        return projetService.modifier(id, auth.getName(), requete);
    }

    @PatchMapping("/{id}/statut")
    public ProjetDetailDto changerStatut(Authentication auth, @PathVariable Long id,
                                         @Valid @RequestBody StatutRequete requete) {
        return projetService.changerStatut(id, auth.getName(), requete.statut());
    }

    // ----- Demandes -----

    @PostMapping("/{id}/demandes")
    @ResponseStatus(HttpStatus.CREATED)
    public DemandeDto envoyerDemande(Authentication auth, @PathVariable Long id,
                                     @Valid @RequestBody DemandeRequete requete) {
        return demandeService.envoyer(id, auth.getName(), requete);
    }

    @GetMapping("/{id}/demandes")
    public List<DemandeRecueDto> listerDemandes(Authentication auth, @PathVariable Long id,
                                                @RequestParam(required = false) StatutDemande statut) {
        return demandeService.lister(id, auth.getName(), statut);
    }

    @PatchMapping("/{id}/demandes/{demandeId}")
    public DemandeDto deciderDemande(Authentication auth, @PathVariable Long id, @PathVariable Long demandeId,
                                     @Valid @RequestBody DecisionRequete requete) {
        return demandeService.decider(id, demandeId, auth.getName(), requete.decision());
    }

    // ----- Membres -----

    @GetMapping("/{id}/membres")
    public List<MembreDto> membres(@PathVariable Long id) {
        return membreService.lister(id);
    }

    @DeleteMapping("/{id}/membres/{utilisateurId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void retirerMembre(Authentication auth, @PathVariable Long id, @PathVariable Long utilisateurId,
                              @Valid @RequestBody DepartRequete requete) {
        membreService.retirer(id, utilisateurId, auth.getName(), requete.motif());
    }

    //-----------Departs------------

    @GetMapping("/{id}/departs")
    public List<DepartDto> departs(Authentication auth, @PathVariable Long id) {
        return membreService.listerDeparts(id, auth.getName());
    }

    // ----- Discussions (réservées aux membres) -----

    @GetMapping("/{id}/discussions")
    public PageDto<DiscussionDto> lireDiscussions(Authentication auth, @PathVariable Long id,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "20") int taille) {
        return discussionService.lire(id, auth.getName(), page, taille);
    }

    @PostMapping("/{id}/discussions")
    @ResponseStatus(HttpStatus.CREATED)
    public DiscussionDto ecrireDiscussion(Authentication auth, @PathVariable Long id,
                                          @Valid @RequestBody DiscussionRequete requete) {
        return discussionService.ecrire(id, auth.getName(), requete);
    }
}