package com.cadev.backend.repository;

import com.cadev.backend.entite.DepartProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DepartProjetRepository extends JpaRepository<DepartProjet, Long> {

    @Query("select d from DepartProjet d join fetch d.utilisateur u left join fetch u.profil "
            + "where d.projet.id = :projetId order by d.dateDepart desc")
    List<DepartProjet> findPourProjet(@Param("projetId") Long projetId);
}