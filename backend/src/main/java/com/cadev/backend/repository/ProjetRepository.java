package com.cadev.backend.repository;

import com.cadev.backend.entite.Projet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetRepository extends JpaRepository<Projet, Long> {
}