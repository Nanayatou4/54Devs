package com.cadev.backend.dto.sortie;

public record MentorResumeDto(DeveloppeurResumeDto developpeur, String presentation,
                              int nombreMentoresMax, int placesRestantes) {
}
