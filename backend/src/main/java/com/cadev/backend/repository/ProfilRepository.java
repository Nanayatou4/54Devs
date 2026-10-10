package com.cadev.backend.repository;

import com.cadev.backend.entite.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProfilRepository extends JpaRepository<Profil, Long>, JpaSpecificationExecutor<Profil> {
    Optional<Profil> findByUtilisateurId(Long utilisateurId);
    Optional<Profil> findByUtilisateurEmail(String email);
}