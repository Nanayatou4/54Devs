package com.cadev.backend.entite;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "soumission_competition",
        uniqueConstraints = @UniqueConstraint(columnNames = {"competition_id", "utilisateur_id"}))
@Getter
@Setter
@NoArgsConstructor
public class SoumissionCompetition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @Column(nullable = false, length = 500)
    private String urlDepot;

    @Column(nullable = false, length = 3000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime dateSoumission;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private boolean evaluee = false;

    @Column(length = 2000)
    private String retourEvaluation;

    @PrePersist
    void avantCreation() {
        dateSoumission = LocalDateTime.now();
    }
}
