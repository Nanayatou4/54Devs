package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.CompetenceUtilisateurDto;
import com.cadev.backend.dto.entree.CompetenceUtilisateurRequete;
import com.cadev.backend.dto.sortie.ProfilDto;
import com.cadev.backend.dto.entree.ProfilRequete;
import com.cadev.backend.entite.Competence;
import com.cadev.backend.entite.CompetenceUtilisateur;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.exception.RessourceIntrouvableException;
import com.cadev.backend.repository.CompetenceRepository;
import com.cadev.backend.repository.CompetenceUtilisateurRepository;
import com.cadev.backend.repository.ProfilRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfilService {

    private static final int MAX_COMPETENCES = 50;

    private final ProfilRepository profils;
    private final UtilisateurRepository utilisateurs;
    private final CompetenceRepository competences;
    private final CompetenceUtilisateurRepository competencesUtilisateur;

    @Transactional(readOnly = true)
    public ProfilDto monProfil(String email) {
        return ProfilDto.depuis(trouverProfil(email));
    }

    @Transactional
    public ProfilDto modifierMonProfil(String email, ProfilRequete req) {
        Profil p = trouverProfil(email);
        p.setPseudo(req.pseudo().trim());
        p.setBio(req.bio());
        p.setPays(req.pays());
        p.setVille(req.ville());
        if (req.niveau() != null) {
            p.setNiveau(req.niveau());
        }
        p.setDisponibilite(req.disponibilite());
        p.setGithub(req.github());
        p.setLinkedin(req.linkedin());
        p.setPortfolio(req.portfolio());
        String avatar = req.avatarUrl();
        p.setAvatarUrl(avatar == null || avatar.isBlank() ? null : avatar.trim());
        return ProfilDto.depuis(p); // enregistré automatiquement à la fin de la transaction
    }

    @Transactional(readOnly = true)
    public List<CompetenceUtilisateurDto> mesCompetences(String email) {
        Utilisateur u = trouverUtilisateur(email);
        return competencesUtilisateur.findAvecCompetence(u.getId()).stream()
                .map(CompetenceUtilisateurDto::depuis)
                .toList();
    }

    @Transactional
    public List<CompetenceUtilisateurDto> remplacerMesCompetences(String email, List<CompetenceUtilisateurRequete> demandes) {
        if (demandes == null) {
            throw new RequeteInvalideException("La liste de compétences est obligatoire");
        }
        if (demandes.size() > MAX_COMPETENCES) {
            throw new RequeteInvalideException("Maximum " + MAX_COMPETENCES + " compétences");
        }
        for (CompetenceUtilisateurRequete d : demandes) {
            if (d == null || d.competenceId() == null || d.type() == null) {
                throw new RequeteInvalideException("Chaque compétence doit avoir un competenceId et un type");
            }
        }

        Utilisateur u = trouverUtilisateur(email);

        // On retire les doublons exacts (même compétence, même type)
        Map<String, CompetenceUtilisateurRequete> uniques = new LinkedHashMap<>();
        for (CompetenceUtilisateurRequete d : demandes) {
            uniques.put(d.competenceId() + "-" + d.type(), d);
        }

        Set<Long> ids = uniques.values().stream()
                .map(CompetenceUtilisateurRequete::competenceId)
                .collect(Collectors.toSet());
        Map<Long, Competence> trouvees = competences.findAllById(ids).stream()
                .collect(Collectors.toMap(Competence::getId, c -> c));
        if (trouvees.size() != ids.size()) {
            throw new RequeteInvalideException("Une ou plusieurs compétences n'existent pas");
        }

        competencesUtilisateur.supprimerParUtilisateur(u.getId());

        List<CompetenceUtilisateur> nouvelles = uniques.values().stream().map(d -> {
            CompetenceUtilisateur cu = new CompetenceUtilisateur();
            cu.setUtilisateur(u);
            cu.setCompetence(trouvees.get(d.competenceId()));
            cu.setType(d.type());
            cu.setNiveau(d.niveau());
            return cu;
        }).toList();

        competencesUtilisateur.saveAll(nouvelles);
        return nouvelles.stream().map(CompetenceUtilisateurDto::depuis).toList();
    }

    private Profil trouverProfil(String email) {
        return profils.findByUtilisateurEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Profil introuvable"));
    }

    private Utilisateur trouverUtilisateur(String email) {
        return utilisateurs.findByEmail(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }
}