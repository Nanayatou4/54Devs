package com.cadev.backend.repository;

import com.cadev.backend.entite.DiscussionProjet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface DiscussionProjetRepository extends JpaRepository<DiscussionProjet, Long> {

    @Query(value = "select d from DiscussionProjet d join fetch d.auteur a left join fetch a.profil "
            + "where d.projet.id = :projetId",
            countQuery = "select count(d) from DiscussionProjet d where d.projet.id = :projetId")
    Page<DiscussionProjet> findPourProjet(@Param("projetId") Long projetId, Pageable pageable);
}