package com.cadev.backend.repository;

import com.cadev.backend.entite.ProfilMentor;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProfilMentorRepository extends JpaRepository<ProfilMentor, Long>, JpaSpecificationExecutor<ProfilMentor> {

    Optional<ProfilMentor> findByUtilisateurId(Long utilisateurId);

    /** Verrou : deux acceptations simultanées ne peuvent pas dépasser le maximum du mentor. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from ProfilMentor m where m.utilisateur.id = :utilisateurId")
    Optional<ProfilMentor> findPourMiseAJour(@Param("utilisateurId") Long utilisateurId);

    long countByActifTrue();

}

