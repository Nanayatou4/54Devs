package com.cadev.backend.dto.sortie;

public record MonProfilMentorDto(boolean estMentor, String presentation, int nombreMentoresMax,
                                 boolean actif, int placesRestantes) {
}
