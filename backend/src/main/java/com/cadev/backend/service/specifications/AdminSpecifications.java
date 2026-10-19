package com.cadev.backend.service.specifications;

import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.enumeration.Role;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class AdminSpecifications {

    public static Specification<Utilisateur> utilisateurs(String texte, Role role, Boolean actif) {
        return (root, query, cb) -> {
            List<Predicate> conditions = new ArrayList<>();
            if (texte != null && !texte.isBlank()) {
                String motif = "%" + texte.trim().toLowerCase() + "%";
                conditions.add(cb.or(
                        cb.like(cb.lower(root.get("nom")), motif),
                        cb.like(cb.lower(root.get("prenom")), motif),
                        cb.like(cb.lower(root.get("email")), motif)));
            }
            if (role != null) {
                conditions.add(cb.equal(root.get("role"), role));
            }
            if (actif != null) {
                conditions.add(cb.equal(root.get("actif"), actif));
            }
            return cb.and(conditions.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}