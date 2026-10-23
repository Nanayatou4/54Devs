package com.cadev.backend.repository;

import com.cadev.backend.entite.Competence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {
    List<Competence> findByCategorieIgnoreCaseOrderByNomAsc(String categorie);
    Optional<Competence> findByNomIgnoreCase(String nom);
}
