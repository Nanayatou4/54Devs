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
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auteur_id")
    private Utilisateur auteur;

    @Column(nullable = false, length = 150)
    private String titre;

    @Column(nullable = false, length = 5000)
    private String contenu;

    @Column(length = 100)
    private String categorie;

    /** Vrai quand une réponse a été marquée comme solution. */
    @Column(nullable = false)
    private boolean resolue;

    /** Compteur conservé à part pour pouvoir trier les questions par popularité. */
    @Column(nullable = false)
    private int nombreReponses;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    void avantCreation() {
        this.dateCreation = LocalDateTime.now();
    }
}

