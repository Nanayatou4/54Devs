package com.cadev.backend.repository;

import com.cadev.backend.entite.SeanceMentorat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeanceMentoratRepository extends JpaRepository<SeanceMentorat, Long> {

    List<SeanceMentorat> findByMentoratIdOrderByDateDesc(Long mentoratId);

    @Query("select count(s) from SeanceMentorat s where s.mentorat.mentor.id = :mentorId "
            + "and s.statut = com.cadev.backend.enumeration.StatutSeance.REALISEE")
    long compterSeancesAnimees(@Param("mentorId") Long mentorId);
}
