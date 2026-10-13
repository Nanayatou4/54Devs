package com.cadev.backend.dto.sortie;

public record MentorDetailDto(DeveloppeurResumeDto developpeur, String presentation, int nombreMentoresMax,
                              int placesRestantes, long mentoratsTermines) {
}
