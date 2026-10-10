package com.cadev.backend.entite;

import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titre;

    @Column(nullable = false, length = 5000)
    private String enonce;

    @Column(length = 5000)
    private String extraitCode;

    @Column(length = 50)
    private String langage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeChallenge type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficulteChallenge difficulte;

    @Column(nullable = false)
    private int points;

    /** Réponses acceptées, séparées par « | ». Ne sort jamais de l'API. */
    @Column(nullable = false, length = 500)
    private String reponsesAcceptees;

    @Column(length = 2000)
    private String explication;

    @Column(nullable = false)
    private int nombreEssaisMax = 3;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;
}


