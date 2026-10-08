package com.cadev.backend.entite;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class DepartProjet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "projet_id")
    private Projet projet;

    /** La personne qui est partie (ou qui a été retirée). */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Column(nullable = false, length = 500)
    private String motif;

    @Column(nullable = false)
    private boolean retireParCreateur;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateDepart;

    @PrePersist
    void avantCreation() {
        this.dateDepart = LocalDateTime.now();
    }
}