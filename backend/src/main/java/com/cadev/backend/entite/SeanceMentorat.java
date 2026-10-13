package com.cadev.backend.entite;

import com.cadev.backend.enumeration.StatutSeance;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "seance_mentorat")
@Getter
@Setter
@NoArgsConstructor
public class SeanceMentorat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mentorat_id")
    private Mentorat mentorat;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private int dureeMinutes;

    @Column(length = 200)
    private String sujet;

    @Column(length = 3000)
    private String compteRendu;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutSeance statut = StatutSeance.PLANIFIEE;
}
