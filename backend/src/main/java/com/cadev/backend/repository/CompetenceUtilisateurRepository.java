package com.cadev.backend.repository;

import com.cadev.backend.entite.CompetenceUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompetenceUtilisateurRepository extends JpaRepository<CompetenceUtilisateur, Long> {
    List<CompetenceUtilisateur> findByUtilisateurId(Long utilisateurId);
    void deleteByUtilisateurId(Long utilisateurId);
}