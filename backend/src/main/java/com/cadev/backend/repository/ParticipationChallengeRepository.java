package com.cadev.backend.repository;

import com.cadev.backend.entite.ParticipationChallenge;
import com.cadev.backend.enumeration.StatutParticipation;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ParticipationChallengeRepository extends JpaRepository<ParticipationChallenge, Long> {

    /** Verrou : deux réponses simultanées du même utilisateur ne peuvent pas dépasser le nombre d'essais. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from ParticipationChallenge p where p.challenge.id = :challengeId and p.utilisateur.id = :utilisateurId")
    Optional<ParticipationChallenge> findPourMiseAJour(@Param("challengeId") Long challengeId, @Param("utilisateurId") Long utilisateurId);

    Optional<ParticipationChallenge> findByChallengeIdAndUtilisateurId(Long challengeId, Long utilisateurId);

    List<ParticipationChallenge> findByUtilisateurIdAndChallengeIdIn(Long utilisateurId, Collection<Long> challengeIds);

    long countByChallengeIdAndStatut(Long challengeId, StatutParticipation statut);

    @Query("select p.challenge.id, count(p) from ParticipationChallenge p "
            + "where p.challenge.id in :ids and p.statut = :statut group by p.challenge.id")
    List<Object[]> compterParChallenge(@Param("ids") Collection<Long> ids,
                                       @Param("statut") StatutParticipation statut);

    /** Une ligne par utilisateur : [id, total des points, nombre de challenges réussis]. */
    @Query("select p.utilisateur.id, sum(p.score), count(p) from ParticipationChallenge p "
            + "where p.statut = com.cadev.backend.enumeration.StatutParticipation.REUSSIE "
            + "group by p.utilisateur.id "
            + "order by sum(p.score) desc, count(p) desc, max(p.dateReussite) asc")
    List<Object[]> classement(Pageable pageable);

    @Query("select count(distinct p.utilisateur.id) from ParticipationChallenge p "
            + "where p.statut = com.cadev.backend.enumeration.StatutParticipation.REUSSIE")
    long compterClasses();

    long countByUtilisateurIdAndStatut(Long utilisateurId, StatutParticipation statut);

    @Query("select p.dateReussite from ParticipationChallenge p "
            + "where p.utilisateur.id = :id "
            + "and p.statut = com.cadev.backend.enumeration.StatutParticipation.REUSSIE")
    List<LocalDateTime> datesReussites(@Param("id") Long id);

}