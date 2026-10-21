package com.cadev.backend.entite;

import com.cadev.backend.enumeration.StatutInvitation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "invitation_projet")
@NoArgsConstructor
public class InvitationProjet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "projet_id")
    private Projet projet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invite_id")
    private Utilisateur invite;

    @Column(length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutInvitation statut = StatutInvitation.EN_ATTENTE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInvitation;

    private LocalDateTime dateReponse;

    /** Renseignée à l'acceptation : preuve que l'invité s'est engagé. */
    private LocalDateTime engagementAccepteLe;

    @PrePersist
    void avantCreation() {
        this.dateInvitation = LocalDateTime.now();
    }
}