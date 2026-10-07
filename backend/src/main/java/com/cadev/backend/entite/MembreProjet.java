package com.cadev.backend.entite;

import com.cadev.backend.enumeration.RoleMembre;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "membre_projet", uniqueConstraints = @UniqueConstraint(columnNames = {"projet_id", "utilisateur_id"}))
public class MembreProjet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "projet_id")
    private Projet projet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleMembre role = RoleMembre.MEMBRE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateAdhesion;

    @PrePersist
    void avantCreation() {
        this.dateAdhesion = LocalDateTime.now();
    }

}