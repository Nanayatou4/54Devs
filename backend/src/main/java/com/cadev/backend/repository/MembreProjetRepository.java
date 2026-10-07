package com.cadev.backend.repository;

import com.cadev.backend.entite.MembreProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MembreProjetRepository extends JpaRepository<MembreProjet, Long> {

    long countByProjetId(Long projetId);

    boolean existsByProjetIdAndUtilisateurId(Long projetId, Long utilisateurId);

    @Query("select m from MembreProjet m join fetch m.utilisateur u left join fetch u.profil "
            + "where m.projet.id = :projetId order by m.dateAdhesion")
    List<MembreProjet> findAvecUtilisateur(@Param("projetId") Long projetId);
}