package com.cadev.backend.repository;

import com.cadev.backend.entite.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReponseRepository extends JpaRepository<Reponse, Long> {

    @Query("select r from Reponse r join fetch r.auteur a left join fetch a.profil "
            + "where r.question.id = :questionId order by r.solution desc, r.dateCreation asc")
    List<Reponse> findPourQuestion(@Param("questionId") Long questionId);

    List<Reponse> findByQuestionIdAndSolutionTrue(Long questionId);

    @Query("select count(r) from Reponse r "
            + "where r.auteur.id = :id and r.solution = true and r.question.auteur.id <> :id")
    long compterSolutions(@Param("id") Long id);

    @Query("select count(r) from Reponse r where r.auteur.id = :id and r.question.auteur.id <> :id")
    long compterReponsesAuxAutres(@Param("id") Long id);

}