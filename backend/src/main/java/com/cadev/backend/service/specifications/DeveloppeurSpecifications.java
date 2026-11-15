package com.cadev.backend.service.specifications;

import com.cadev.backend.entite.CompetenceUtilisateur;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.Role;
import com.cadev.backend.enumeration.TypeCompetence;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class DeveloppeurSpecifications {

    public static Specification<Profil> filtres(Long moiId, String texte, Long competenceId,
                                                TypeCompetence type, String pays, Niveau niveau,
                                                String disponibilite) {
        return (root, query, cb) -> {
            List<Predicate> conditions = new ArrayList<>();
            Join<Profil, Utilisateur> utilisateur = root.join("utilisateur");

            conditions.add(cb.isTrue(utilisateur.get("actif")));
            conditions.add(cb.notEqual(utilisateur.get("role"), Role.ADMIN));
            if (moiId != null) {
                conditions.add(cb.notEqual(utilisateur.get("id"), moiId)); // jamais soi-même
            }

            if (texte != null && !texte.isBlank()) {
                String motif = "%" + texte.trim().toLowerCase() + "%";
                conditions.add(cb.or(
                        cb.like(cb.lower(root.get("pseudo")), motif),
                        cb.like(cb.lower(utilisateur.get("prenom")), motif),
                        cb.like(cb.lower(utilisateur.get("nom")), motif),
                        cb.like(cb.lower(root.get("bio")), motif)));
            }
            if (pays != null && !pays.isBlank()) {
                conditions.add(cb.equal(cb.lower(root.get("pays")), pays.trim().toLowerCase()));
            }
            if (niveau != null) {
                conditions.add(cb.equal(root.get("niveau"), niveau));
            }
            if (disponibilite != null && !disponibilite.isBlank()) {
                conditions.add(cb.like(cb.lower(root.get("disponibilite")),
                        "%" + disponibilite.trim().toLowerCase() + "%"));
            }
            if (competenceId != null) {
                Subquery<Long> sous = query.subquery(Long.class);
                Root<CompetenceUtilisateur> cu = sous.from(CompetenceUtilisateur.class);
                List<jakarta.persistence.criteria.Predicate> dansSous = new ArrayList<>();
                dansSous.add(cb.equal(cu.get("utilisateur"), utilisateur));
                dansSous.add(cb.equal(cu.get("competence").get("id"), competenceId));
                if (type != null) {
                    dansSous.add(cb.equal(cu.get("type"), type));
                }
                sous.select(cu.get("id")).where(dansSous.toArray(new jakarta.persistence.criteria.Predicate[0]));
                conditions.add(cb.exists(sous));
            }
            return cb.and(conditions.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
