package com.cadev.backend.repository;

import com.cadev.backend.entite.SoumissionCompetition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SoumissionCompetitionRepository extends JpaRepository<SoumissionCompetition, Long> {
    Optional<SoumissionCompetition> findByCompetitionIdAndUtilisateurId(Long competitionId, Long utilisateurId);
    List<SoumissionCompetition> findByCompetitionIdOrderByScoreDescDateSoumissionAsc(Long competitionId);
}
