package com.cadev.backend.dto.sortie;

import java.time.LocalDateTime;
import java.util.List;

public record QuestionDetailDto(Long id, String titre, String contenu, String categorie,
                                LocalDateTime dateCreation, boolean resolue, int nombreReponses,
                                UtilisateurResumeDto auteur, boolean estAuteur,
                                List<ReponseDto> reponses) {}
