package com.cadev.backend.repository;

import com.cadev.backend.entite.CompetenceUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompetenceUtilisateurRepository extends JpaRepository<CompetenceUtilisateur, Long> {
    List<CompetenceUtilisateur> findByUtilisateurId(Long utilisateurId);
    void deleteByUtilisateurId(Long utilisateurId);

    @Query("select cu from CompetenceUtilisateur cu join fetch cu.competence "
            + "where cu.utilisateur.id = :utilisateurId order by cu.type, cu.competence.nom")
    List<CompetenceUtilisateur> findAvecCompetence(@Param("utilisateurId") Long utilisateurId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from CompetenceUtilisateur cu where cu.utilisateur.id = :utilisateurId")
    void supprimerParUtilisateur(@Param("utilisateurId") Long utilisateurId);
}