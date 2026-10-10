package com.cadev.backend.entite;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "badge_utilisateur", uniqueConstraints = @UniqueConstraint(columnNames = {"utilisateur_id", "badge_id"}))
@Getter
@Setter
@NoArgsConstructor
public class BadgeUtilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "badge_id")
    private Badge badge;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateObtention;

    @PrePersist
    void avantCreation() {
        this.dateObtention = LocalDateTime.now();
    }
}