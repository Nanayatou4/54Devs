package com.cadev.backend.entite;

import com.cadev.backend.enumeration.Niveau;
import com.cadev.backend.enumeration.TypeCompetence;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "competences_utilisateur", uniqueConstraints = @UniqueConstraint(columnNames = {"utilisateur_id", "competence_id", "type"}))
public class CompetenceUtilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "competence_id")
    private Competence competence;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeCompetence type;

    @Enumerated(EnumType.STRING)
    private Niveau niveau;

}