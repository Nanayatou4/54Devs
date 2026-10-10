package com.cadev.backend.repository;

import com.cadev.backend.entite.MembreProjet;
import com.cadev.backend.enumeration.StatutProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MembreProjetRepository extends JpaRepository<MembreProjet, Long> {

    long countByProjetId(Long projetId);

    boolean existsByProjetIdAndUtilisateurId(Long projetId, Long utilisateurId);

    @Query("select m from MembreProjet m join fetch m.utilisateur u left join fetch u.profil "
            + "where m.projet.id = :projetId order by m.dateAdhesion")
    List<MembreProjet> findAvecUtilisateur(@Param("projetId") Long projetId);

    Optional<MembreProjet> findByProjetIdAndUtilisateurId(Long projetId, Long utilisateurId);

    @Query("select m from MembreProjet m join fetch m.projet p "
            + "where m.utilisateur.id = :utilisateurId order by p.dateCreation desc")
    List<MembreProjet> findMesProjets(@Param("utilisateurId") Long utilisateurId);

    @Query("select m.projet.id, count(m) from MembreProjet m where m.projet.id in :ids group by m.projet.id")
    List<Object[]> compterParProjet(@Param("ids") Collection<Long> ids);

    @Query("select count(m) from MembreProjet m "
            + "where m.utilisateur.id = :utilisateurId and m.projet.statut in :statuts")
    long compterProjetsActifs(@Param("utilisateurId") Long utilisateurId,
                              @Param("statuts") Collection<StatutProjet> statuts);

    long countByUtilisateurId(Long utilisateurId);

    @Query("select count(m) from MembreProjet m where m.utilisateur.id = :id "
            + "and m.projet.statut = StatutProjet.TERMINE")
    long compterProjetsTermines(@Param("id") Long id);
}