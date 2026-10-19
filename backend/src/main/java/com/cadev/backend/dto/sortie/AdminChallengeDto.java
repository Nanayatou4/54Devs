package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;

import java.time.LocalDate;
import java.util.List;

public record AdminChallengeDto(Long id, String titre, TypeChallenge type, DifficulteChallenge difficulte,
                                int points, LocalDate dateDebut, LocalDate dateFin, int nombreEssaisMax,
                                List<String> reponsesAcceptees, long nombreParticipants, long nombreReussites) {
}
