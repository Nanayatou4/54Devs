package com.cadev.backend.entite;

import com.cadev.backend.enumeration.StatutParticipation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "participation_challenge", uniqueConstraints = @UniqueConstraint(columnNames = {"challenge_id", "utilisateur_id"}))
@Getter
@Setter
@NoArgsConstructor
public class ParticipationChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "challenge_id")
    private Challenge challenge;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Column(length = 500)
    private String derniereReponse;

    @Column(nullable = false)
    private int nombreEssais;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutParticipation statut = StatutParticipation.EN_COURS;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateParticipation;

    /** Renseignée seulement en cas de réussite (sert à départager les égalités du classement). */
    private LocalDateTime dateReussite;

    @PrePersist
    void avantCreation() {
        this.dateParticipation = LocalDateTime.now();
    }
}