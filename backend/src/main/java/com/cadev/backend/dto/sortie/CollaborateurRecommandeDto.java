package com.cadev.backend.dto.sortie;

public record CollaborateurRecommandeDto(Long projetId, String projetNom, DeveloppeurRecommandeDto candidat) {
}
