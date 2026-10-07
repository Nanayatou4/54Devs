package com.cadev.backend.entite;

import com.cadev.backend.enumeration.Niveau;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "competence_projet")
public class CompetenceProjet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "projet_id")
    private Projet projet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "competence_id")
    private Competence competence;

    private boolean obligatoire;

    @Enumerated(EnumType.STRING)
    private Niveau niveauRequis = Niveau.DEBUTANT;
}