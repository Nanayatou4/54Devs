package com.cadev.backend.repository;

import com.cadev.backend.entite.DemandeAdhesion;
import com.cadev.backend.enumeration.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DemandeAdhesionRepository extends JpaRepository<DemandeAdhesion, Long> {

    Optional<DemandeAdhesion> findFirstByProjetIdAndDemandeurIdOrderByDateDemandeDesc(Long projetId, Long demandeurId);

    boolean existsByProjetIdAndDemandeurIdAndStatut(Long projetId, Long demandeurId, StatutDemande statut);

    long countByProjetIdAndStatut(Long projetId, StatutDemande statut);

    @Query("select d from DemandeAdhesion d join fetch d.demandeur u left join fetch u.profil "
            + "where d.projet.id = :projetId order by d.dateDemande desc")
    List<DemandeAdhesion> findPourProjet(@Param("projetId") Long projetId);

    @Query("select d from DemandeAdhesion d join fetch d.demandeur u left join fetch u.profil "
            + "where d.projet.id = :projetId and d.statut = :statut order by d.dateDemande desc")
    List<DemandeAdhesion> findPourProjetParStatut(@Param("projetId") Long projetId,
                                                  @Param("statut") StatutDemande statut);

    @Query("select d from DemandeAdhesion d join fetch d.projet "
            + "where d.demandeur.id = :demandeurId order by d.dateDemande desc")
    List<DemandeAdhesion> findMesDemandes(@Param("demandeurId") Long demandeurId);
}