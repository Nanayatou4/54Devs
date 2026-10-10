package com.cadev.backend.service.specifications;

import com.cadev.backend.entite.Question;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class QuestionSpecifications {

    public static Specification<Question> filtres(String texte, String categorie, Boolean resolue) {
        return (root, query, cb) -> {
            List<Predicate> conditions = new ArrayList<>();

            if (texte != null && !texte.isBlank()) {
                String motif = "%" + texte.trim().toLowerCase() + "%";
                conditions.add(cb.or(
                        cb.like(cb.lower(root.get("titre")), motif),
                        cb.like(cb.lower(root.get("contenu")), motif)));
            }
            if (categorie != null && !categorie.isBlank()) {
                conditions.add(cb.equal(cb.lower(root.get("categorie")), categorie.trim().toLowerCase()));
            }
            if (resolue != null) {
                conditions.add(cb.equal(root.get("resolue"), resolue));
            }
            return cb.and(conditions.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}