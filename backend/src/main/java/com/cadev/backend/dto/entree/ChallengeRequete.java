package com.cadev.backend.dto.entree;

import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record ChallengeRequete(
        @NotBlank @Size(min = 5, max = 150) String titre,
        @NotBlank @Size(max = 5000) String enonce,
        @Size(max = 5000) String extraitCode,
        @Size(max = 50) String langage,
        @NotNull TypeChallenge type,
        @NotNull DifficulteChallenge difficulte,
        @NotEmpty @Size(max = 10) List<@NotBlank @Size(max = 100) String> reponsesAcceptees,
        @Size(max = 2000) String explication,
        @NotNull @Min(1) @Max(10) Integer nombreEssaisMax,
        @NotNull LocalDate dateDebut,
        @NotNull LocalDate dateFin) {}