package com.cadev.backend.repository;

import com.cadev.backend.entite.DemandeAdhesion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DemandeAdhesionRepository extends JpaRepository<DemandeAdhesion, Long> {

    Optional<DemandeAdhesion> findFirstByProjetIdAndDemandeurIdOrderByDateDemandeDesc(Long projetId, Long demandeurId);
}