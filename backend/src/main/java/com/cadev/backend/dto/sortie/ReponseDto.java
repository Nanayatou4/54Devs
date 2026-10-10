package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.Reponse;

import java.time.LocalDateTime;

public record ReponseDto(Long id, String contenu, boolean solution, LocalDateTime dateCreation,
                         UtilisateurResumeDto auteur) {
    public static ReponseDto depuis(Reponse r) {
        return new ReponseDto(r.getId(), r.getContenu(), r.isSolution(), r.getDateCreation(),
                UtilisateurResumeDto.depuis(r.getAuteur()));
    }
}