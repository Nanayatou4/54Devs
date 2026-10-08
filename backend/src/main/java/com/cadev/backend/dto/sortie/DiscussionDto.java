package com.cadev.backend.dto.sortie;

import com.cadev.backend.entite.DiscussionProjet;

import java.time.LocalDateTime;

public record DiscussionDto(Long id, String contenu, LocalDateTime dateCreation, UtilisateurResumeDto auteur) {

    public static DiscussionDto depuis(DiscussionProjet d) {
        return new DiscussionDto(d.getId(), d.getContenu(), d.getDateCreation(),
                UtilisateurResumeDto.depuis(d.getAuteur()));
    }
}