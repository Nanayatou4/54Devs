package com.cadev.backend.service.specifications;

import com.cadev.backend.entite.CompetenceProjet;
import com.cadev.backend.entite.Projet;
import com.cadev.backend.enumeration.StatutProjet;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

public class ProjetSpecifications {

    public static Specification<Projet> filtres(String texte, String technologie, String categorie,
                                                StatutProjet statut, Long competenceId) {
        return (root, query, cb) -> {
            List<Predicate> conditions = new ArrayList<>();

            if (texte != null && !texte.isBlank()) {
                String motif = "%" + texte.trim().toLowerCase() + "%";
                conditions.add(cb.or(
                        cb.like(cb.lower(root.get("nom")), motif),
                        cb.like(cb.lower(root.get("description")), motif)));
            }
            if (technologie != null && !technologie.isBlank()) {
                conditions.add(cb.like(cb.lower(root.get("technologies")),
                        "%" + technologie.trim().toLowerCase() + "%"));
            }
            if (categorie != null && !categorie.isBlank()) {
                conditions.add(cb.equal(cb.lower(root.get("categorie")), categorie.trim().toLowerCase()));
            }
            if (statut != null) {
                conditions.add(cb.equal(root.get("statut"), statut));
            }
            if (competenceId != null) {
                Subquery<Long> sous = query.subquery(Long.class);
                Root<CompetenceProjet> cp = sous.from(CompetenceProjet.class);
                sous.select(cp.get("id")).where(
                        cb.equal(cp.get("projet"), root),
                        cb.equal(cp.get("competence").get("id"), competenceId));
                conditions.add(cb.exists(sous));
            }
            return cb.and(conditions.toArray(new Predicate[0]));
        };
    }
}
