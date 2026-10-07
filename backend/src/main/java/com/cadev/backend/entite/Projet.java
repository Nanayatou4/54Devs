package com.cadev.backend.entite;

import com.cadev.backend.enumeration.StatutProjet;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "projet")
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(length = 1000)
    private String probleme;

    @Column(length = 1000)
    private String solution;

    @Column(length = 100)
    private String categorie;

    @Column(length = 255)
    private String technologies;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutProjet statut = StatutProjet.IDEE;

    @Column(nullable = false)
    private int nombrePlacesRecherchees;

    @Column(length = 500)
    private String rolesRecherches;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "createur_id")
    private Utilisateur createur;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CompetenceProjet> competencesRecherchees = new ArrayList<>();

    @PrePersist
    void avantCreation() {
        this.dateCreation = LocalDateTime.now();
    }

}