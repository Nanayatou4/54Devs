package com.cadev.backend.entite;

import com.cadev.backend.enumeration.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "utilisateur")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasse; // hash BCrypt, jamais renvoyé par l'API

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.UTILISATEUR;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInscription;

    @Column(nullable = false)
    private boolean actif = true;

    @OneToOne(mappedBy = "utilisateur", cascade = CascadeType.ALL, orphanRemoval = true)
    private Profil profil;

    @PrePersist
    void avantCreation() {
        this.dateInscription = LocalDateTime.now();
    }

}