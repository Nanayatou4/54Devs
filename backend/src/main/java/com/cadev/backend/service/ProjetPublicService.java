package com.cadev.backend.service;

import com.cadev.backend.dto.sortie.ProjetPublicDto;
import com.cadev.backend.dto.sortie.UtilisateurResumeDto;
import com.cadev.backend.entite.Projet;
import com.cadev.backend.enumeration.StatutProjet;
import com.cadev.backend.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProjetPublicService {

    private final ProjetRepository projets;
    private final RechercheProjetService recherche;

    @Transactional(readOnly = true)
    public List<ProjetPublicDto> recents(int limite) {
        List<Projet> recents = projets.findTop30ByStatutNotOrderByDateCreationDesc(StatutProjet.TERMINE);
        Map<Long, Long> nombreMembres = recherche.compterMembres(recents);

        List<ProjetPublicDto> resultat = new ArrayList<>();
        for (Projet p : recents) {
            if (resultat.size() >= limite) {
                break;
            }
            long nb = nombreMembres.getOrDefault(p.getId(), 0L);
            int places = ProjetService.calculerPlacesRestantes(p, nb);
            if (!ProjetService.estOuvertAuxDemandes(p, places)) {
                continue; // projet complet : on ne le met pas en vitrine
            }
            UtilisateurResumeDto createur = UtilisateurResumeDto.depuis(p.getCreateur());
            String description = p.getDescription();
            resultat.add(new ProjetPublicDto(
                    p.getId(), p.getNom(),
                    description.length() > 150 ? description.substring(0, 150) + "…" : description,
                    p.getCategorie(), p.getTechnologies(), p.getImageUrl(), p.getStatut(), places, (int) nb,
                    p.getCompetencesRecherchees().stream().map(cp -> cp.getCompetence().getNom()).toList(),
                    createur.pseudo(), createur.pays(), createur.avatarUrl()));
        }
        return resultat;
    }
}
