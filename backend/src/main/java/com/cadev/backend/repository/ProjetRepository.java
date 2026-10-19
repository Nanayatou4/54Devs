package com.cadev.backend.repository;

import com.cadev.backend.entite.Projet;
import com.cadev.backend.enumeration.StatutProjet;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjetRepository extends JpaRepository<Projet, Long> , JpaSpecificationExecutor<Projet> {

    /** Verrou en écriture : empêche deux acceptations simultanées de dépasser les places. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Projet p where p.id = :id")
    Optional<Projet> findByIdPourMiseAJour(@Param("id") Long id);

    //  les projets candidats à une recommandation pour un utilisateur
    @Query("select distinct p from Projet p "
            + "left join fetch p.competencesRecherchees cp left join fetch cp.competence "
            + "where p.statut <> com.cadev.backend.enumeration.StatutProjet.TERMINE "
            + "and p.id not in (select m.projet.id from MembreProjet m where m.utilisateur.id = :utilisateurId) "
            + "and p.id not in (select d.projet.id from DemandeAdhesion d where d.demandeur.id = :utilisateurId "
            + "and d.statut = com.cadev.backend.enumeration.StatutDemande.EN_ATTENTE)")
    List<Projet> findCandidatsPourRecommandation(@Param("utilisateurId") Long utilisateurId);

    List<Projet> findTop30ByStatutNotOrderByDateCreationDesc(StatutProjet statut);

    @Query("select p.statut, count(p) from Projet p group by p.statut")
    List<Object[]> compterParStatut();

}