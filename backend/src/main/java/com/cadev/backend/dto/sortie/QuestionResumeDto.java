package com.cadev.backend.dto.sortie;

import java.time.LocalDateTime;

public record QuestionResumeDto(Long id, String titre, String extrait, String categorie,
                                int nombreReponses, boolean resolue, LocalDateTime dateCreation,
                                UtilisateurResumeDto auteur) {}

