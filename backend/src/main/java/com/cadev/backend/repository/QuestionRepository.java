package com.cadev.backend.repository;

import com.cadev.backend.entite.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> , JpaSpecificationExecutor<Question> {

    @Query("select distinct q.categorie from Question q "
            + "where q.categorie is not null and q.categorie <> '' order by q.categorie")
    List<String> categories();

    /** Incrément atomique : fiable même si deux réponses arrivent en même temps. */
    @Modifying(flushAutomatically = true)
    @Query("update Question q set q.nombreReponses = q.nombreReponses + 1 where q.id = :id")
    void incrementerReponses(@Param("id") Long id);

    long countByAuteurId(Long auteurId);

    List<Question> findTop50ByResolueFalseAndAuteurIdNotOrderByDateCreationDesc(Long auteurId);
    long countByResolueFalse();


}