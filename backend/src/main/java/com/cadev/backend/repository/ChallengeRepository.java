package com.cadev.backend.repository;

import com.cadev.backend.entite.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> , JpaSpecificationExecutor<Challenge> {

    @Query("select c from Challenge c where c.dateDebut <= :jour and c.dateFin >= :jour order by c.id")
    List<Challenge> findOuverts(@Param("jour") LocalDate jour);
}