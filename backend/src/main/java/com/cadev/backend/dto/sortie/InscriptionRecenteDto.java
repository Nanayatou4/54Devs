package com.cadev.backend.dto.sortie;

import java.time.LocalDateTime;

public record InscriptionRecenteDto(Long id, String prenom, String nom, String email, LocalDateTime dateInscription) {
}
