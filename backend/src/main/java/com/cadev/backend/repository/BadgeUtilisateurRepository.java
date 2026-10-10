package com.cadev.backend.repository;

import com.cadev.backend.entite.BadgeUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BadgeUtilisateurRepository extends JpaRepository<BadgeUtilisateur, Long> {

    boolean existsByUtilisateurIdAndBadgeCode(Long utilisateurId, String code);

    @Query("select bu from BadgeUtilisateur bu join fetch bu.badge "
            + "where bu.utilisateur.id = :utilisateurId order by bu.dateObtention")
    List<BadgeUtilisateur> findAvecBadge(@Param("utilisateurId") Long utilisateurId);
}