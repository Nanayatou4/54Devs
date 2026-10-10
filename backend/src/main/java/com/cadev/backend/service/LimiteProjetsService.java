package com.cadev.backend.service;

import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.StatutProjet;
import com.cadev.backend.exception.ConflitException;
import com.cadev.backend.repository.MembreProjetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LimiteProjetsService {

    private static final List<StatutProjet> STATUTS_ACTIFS =
            List.of(StatutProjet.IDEE, StatutProjet.EN_DEVELOPPEMENT, StatutProjet.EN_LANCEMENT,StatutProjet.EN_PAUSE);

    private final MembreProjetRepository membres;
    private final int maximum;

    public LimiteProjetsService(MembreProjetRepository membres,
                                @Value("${app.projets.max-actifs-par-membre:2}") int maximum) {
        this.membres = membres;
        this.maximum = maximum;
    }

    /** Lance un 409 si la personne a déjà atteint le maximum de projets actifs. */
    public void verifier(Utilisateur utilisateur, boolean pourSoiMeme) {
        long actifs = membres.compterProjetsActifs(utilisateur.getId(), STATUTS_ACTIFS);
        if (actifs >= maximum) {
            throw new ConflitException((pourSoiMeme ? "Vous participez" : "Cette personne participe")
                    + " déjà à " + maximum + " projets actifs (maximum autorisé)");
        }
    }

    public static boolean estActif(StatutProjet statut) {
        return STATUTS_ACTIFS.contains(statut);
    }
}
