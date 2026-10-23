package com.cadev.backend.service.specifications;

import com.cadev.backend.entite.CompetenceUtilisateur;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.ProfilMentor;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.TypeCompetence;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class MentorSpecifications {

    public static Specification<ProfilMentor> filtres(Long moiId, String texte, Long competenceId,
                                                      String pays, Niveau niveau) {
        return (root, query, cb) -> {
            List<Predicate> conditions = new ArrayList<>();
            Join<ProfilMentor, Utilisateur> utilisateur = root.join("utilisateur");
            Join<Utilisateur, Profil> profil = utilisateur.join("profil", JoinType.LEFT);

            conditions.add(cb.isTrue(root.get("actif")));
            conditions.add(cb.isTrue(utilisateur.get("actif")));
            if (moiId != null) {
                conditions.add(cb.notEqual(utilisateur.get("id"), moiId)); // jamais soi-même
            }

            if (texte != null && !texte.isBlank()) {
                String motif = "%" + texte.trim().toLowerCase() + "%";
                conditions.add(cb.or(
                        cb.like(cb.lower(profil.get("pseudo")), motif),
                        cb.like(cb.lower(utilisateur.get("prenom")), motif),
                        cb.like(cb.lower(utilisateur.get("nom")), motif),
                        cb.like(cb.lower(root.get("presentation")), motif)));
            }
            if (pays != null && !pays.isBlank()) {
                conditions.add(cb.equal(cb.lower(profil.get("pays")), pays.trim().toLowerCase()));
            }
            if (niveau != null) {
                conditions.add(cb.equal(profil.get("niveau"), niveau));
            }
            if (competenceId != null) {
                // Un mentor est trouvé par les compétences qu'il peut ENSEIGNER
                Subquery<Long> sous = query.subquery(Long.class);
                Root<CompetenceUtilisateur> cu = sous.from(CompetenceUtilisateur.class);
                sous.select(cu.get("id")).where(
                        cb.equal(cu.get("utilisateur"), utilisateur),
                        cb.equal(cu.get("competence").get("id"), competenceId),
                        cb.equal(cu.get("type"), TypeCompetence.ENSEIGNER));
                conditions.add(cb.exists(sous));
            }
            return cb.and(conditions.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
