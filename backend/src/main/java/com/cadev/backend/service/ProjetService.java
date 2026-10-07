package com.cadev.backend.service;

import com.cadev.backend.dto.*;
import com.cadev.backend.entite.*;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.RoleMembre;
import com.cadev.backend.enumeration.StatutProjet;
import com.cadev.backend.exception.ActionInterditeException;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjetService {

    private final ProjetRepository projets;
    private final UtilisateurRepository utilisateurs;
    private final CompetenceRepository competences;
    private final MembreProjetRepository membres;
    private final DemandeAdhesionRepository demandes;

    @Transactional
    public ProjetDetailDto creer(String email, ProjetRequete req) {
        Utilisateur moi = trouverUtilisateur(email);

        Projet p = new Projet();
        p.setCreateur(moi);
        appliquer(p, req);
        projets.save(p);

        MembreProjet m = new MembreProjet();
        m.setProjet(p);
        m.setUtilisateur(moi);
        m.setRole(RoleMembre.CREATEUR);
        membres.save(m);

        return construireDetail(p, moi);
    }

    @Transactional(readOnly = true)
    public ProjetDetailDto detail(Long id, String email) {
        return construireDetail(trouverProjet(id), trouverUtilisateur(email));
    }

    @Transactional
    public ProjetDetailDto modifier(Long id, String email, ProjetRequete req) {
        Projet p = trouverProjet(id);
        Utilisateur moi = trouverUtilisateur(email);
        verifierCreateur(p, moi);

        long autresMembres = membres.countByProjetId(id) - 1; // sans le créateur
        if (req.nombrePlacesRecherchees() < autresMembres) {
            throw new RequeteInvalideException(
                    "Le nombre de places ne peut pas être inférieur au nombre de membres déjà acceptés ("
                            + autresMembres + ")");
        }

        appliquer(p, req);
        return construireDetail(p, moi);
    }

    @Transactional
    public ProjetDetailDto changerStatut(Long id, String email, StatutProjet statut) {
        Projet p = trouverProjet(id);
        Utilisateur moi = trouverUtilisateur(email);
        verifierCreateur(p, moi);
        p.setStatut(statut);
        return construireDetail(p, moi);
    }

    // ---------- Règle métier réutilisée par la recherche et les demandes ----------

    public static int calculerPlacesRestantes(Projet p, long nombreMembres) {
        return Math.max(0, p.getNombrePlacesRecherchees() - (int) (nombreMembres - 1));
    }

    public static boolean estOuvertAuxDemandes(Projet p, int placesRestantes) {
        return p.getStatut() != StatutProjet.TERMINE && placesRestantes > 0;
    }

    // ---------- Méthodes privées ----------

    private void appliquer(Projet p, ProjetRequete req) {
        p.setNom(req.nom().trim());
        p.setDescription(req.description().trim());
        p.setProbleme(req.probleme());
        p.setSolution(req.solution());
        p.setCategorie(req.categorie() == null ? null : req.categorie().trim());
        p.setTechnologies(req.technologies());
        p.setStatut(req.statut());
        p.setNombrePlacesRecherchees(req.nombrePlacesRecherchees());
        p.setRolesRecherches(req.rolesRecherches());
        remplacerCompetences(p, req.competencesRecherchees());
    }

    private void remplacerCompetences(Projet p, List<CompetenceProjetRequete> demandesComp) {
        Map<Long, CompetenceProjetRequete> uniques = new LinkedHashMap<>();
        if (demandesComp != null) {
            for (CompetenceProjetRequete d : demandesComp) {
                if (d == null || d.competenceId() == null) {
                    throw new RequeteInvalideException("Chaque compétence doit avoir un competenceId");
                }
                uniques.put(d.competenceId(), d);
            }
        }

        Map<Long, Competence> trouvees = competences.findAllById(uniques.keySet()).stream()
                .collect(Collectors.toMap(Competence::getId, c -> c));
        if (trouvees.size() != uniques.size()) {
            throw new RequeteInvalideException("Une ou plusieurs compétences n'existent pas");
        }

        p.getCompetencesRecherchees().clear();
        for (CompetenceProjetRequete d : uniques.values()) {
            CompetenceProjet cp = new CompetenceProjet();
            cp.setProjet(p);
            cp.setCompetence(trouvees.get(d.competenceId()));
            cp.setObligatoire(d.obligatoire());
            cp.setNiveauRequis(d.niveauRequis() != null ? d.niveauRequis() : Niveau.DEBUTANT);
            p.getCompetencesRecherchees().add(cp);
        }
    }

    private ProjetDetailDto construireDetail(Projet p, Utilisateur moi) {
        List<MembreProjet> equipe = membres.findAvecUtilisateur(p.getId());
        int placesRestantes = calculerPlacesRestantes(p, equipe.size());

        boolean estCreateur = p.getCreateur().getId().equals(moi.getId());
        boolean estMembre = equipe.stream().anyMatch(m -> m.getUtilisateur().getId().equals(moi.getId()));
        MaDemandeDto maDemande = demandes
                .findFirstByProjetIdAndDemandeurIdOrderByDateDemandeDesc(p.getId(), moi.getId())
                .map(d -> new MaDemandeDto(d.getId(), d.getStatut()))
                .orElse(null);

        return new ProjetDetailDto(
                p.getId(), p.getNom(), p.getDescription(), p.getProbleme(), p.getSolution(),
                p.getCategorie(), p.getTechnologies(), p.getStatut(),
                p.getNombrePlacesRecherchees(), placesRestantes, estOuvertAuxDemandes(p, placesRestantes),
                p.getRolesRecherches(), p.getDateCreation(),
                UtilisateurResumeDto.depuis(p.getCreateur()),
                p.getCompetencesRecherchees().stream().map(CompetenceProjetDto::depuis).toList(),
                equipe.stream().map(MembreDto::depuis).toList(),
                estCreateur, estMembre, maDemande);
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
