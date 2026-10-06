package com.cadev.backend.repository;

import com.cadev.backend.entite.Profil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfilRepository extends JpaRepository<Profil, Long> {
    Optional<Profil> findByUtilisateurId(Long utilisateurId);
    Optional<Profil> findByUtilisateurEmail(String email);
}