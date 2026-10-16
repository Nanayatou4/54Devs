package com.cadev.backend.entite;

import com.cadev.backend.enumeration.Niveau;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "profil")
public class Profil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(nullable = false)
    private String pseudo;

    @Column(length = 1000)
    private String bio;

    private String pays;
    private String ville;

    @Enumerated(EnumType.STRING)
    private Niveau niveau = Niveau.DEBUTANT;

    private String disponibilite;
    private String github;
    private String linkedin;
    private String portfolio;

    // URL ou image encodee (data:image/...;base64) choisie par l'utilisateur ; null = avatar a initiales
    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

}