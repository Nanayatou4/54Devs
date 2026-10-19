package com.cadev.backend.repository;

import com.cadev.backend.entite.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long>, JpaSpecificationExecutor<Utilisateur> {
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findByGithubId(String githubId);
    Optional<Utilisateur> findByGoogleId(String googleId);
    boolean existsByEmail(String email);

    long countByActifTrue();

    long countByDateInscriptionAfter(LocalDateTime date);
    List<Utilisateur> findTop5ByOrderByDateInscriptionDesc();
}