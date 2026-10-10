package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;

import java.time.LocalDate;

public record ChallengeDetailDto(Long id, String titre, String enonce, String extraitCode, String langage,
                                 TypeChallenge type, DifficulteChallenge difficulte, int points,
                                 int nombreEssaisMax, LocalDate dateDebut, LocalDate dateFin, boolean ouvert,
                                 long nombreReussites, MaParticipationDto maParticipation, String explication) {}

