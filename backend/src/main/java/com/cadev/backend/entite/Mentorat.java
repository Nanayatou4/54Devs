package com.cadev.backend.entite;

import com.cadev.backend.enumeration.StatutMentorat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Mentorat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentor_id")
    private Utilisateur mentor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentore_id")
    private Utilisateur mentore;

    @Column(length = 200)
    private String sujet;

    @Column(length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutMentorat statut = StatutMentorat.EN_ATTENTE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateDemande;

    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;

    @Column(length = 2000)
    private String bilanMentor;

    @Column(length = 2000)
    private String bilanMentore;

    @PrePersist
    void avantCreation() {
        this.dateDemande = LocalDateTime.now();
    }
}
