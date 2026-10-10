package com.cadev.backend.service.specifications;

import com.cadev.backend.entite.Challenge;
import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ChallengeSpecifications {

    public static Specification<Challenge> filtres(TypeChallenge type, DifficulteChallenge difficulte,
                                                   Boolean ouvert, LocalDate jour) {
        return (root, query, cb) -> {
            List<Predicate> conditions = new ArrayList<>();

            // Un challenge qui n'a pas commencé n'est jamais visible
            conditions.add(cb.lessThanOrEqualTo(root.<LocalDate>get("dateDebut"), jour));

            if (type != null) {
                conditions.add(cb.equal(root.get("type"), type));
            }
            if (difficulte != null) {
                conditions.add(cb.equal(root.get("difficulte"), difficulte));
            }
            if (ouvert != null) {
                conditions.add(ouvert
                        ? cb.greaterThanOrEqualTo(root.<LocalDate>get("dateFin"), jour)
                        : cb.lessThan(root.<LocalDate>get("dateFin"), jour));
            }
            return cb.and(conditions.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}