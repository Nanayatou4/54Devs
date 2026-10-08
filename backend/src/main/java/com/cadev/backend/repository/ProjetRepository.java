package com.cadev.backend.repository;

import com.cadev.backend.entite.Projet;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProjetRepository extends JpaRepository<Projet, Long> {

    /** Verrou en écriture : empêche deux acceptations simultanées de dépasser les places. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Projet p where p.id = :id")
    Optional<Projet> findByIdPourMiseAJour(@Param("id") Long id);

    Page<Projet> findAll(Specification<Projet> filtres, Pageable pageable);
}