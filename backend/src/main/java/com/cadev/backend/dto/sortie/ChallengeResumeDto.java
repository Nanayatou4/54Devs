package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;

import java.time.LocalDate;

public record ChallengeResumeDto(Long id, String titre, TypeChallenge type, DifficulteChallenge difficulte,
                                 int points, LocalDate dateDebut, LocalDate dateFin, boolean ouvert,
                                 long nombreReussites, MaParticipationDto maParticipation) {}
