package com.cadev.backend.repository;

import com.cadev.backend.entite.CompetenceUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface CompetenceUtilisateurRepository extends JpaRepository<CompetenceUtilisateur, Long> {
    List<CompetenceUtilisateur> findByUtilisateurId(Long utilisateurId);
    void deleteByUtilisateurId(Long utilisateurId);

    @Query("select cu from CompetenceUtilisateur cu join fetch cu.competence "
            + "where cu.utilisateur.id = :utilisateurId order by cu.type, cu.competence.nom")
    List<CompetenceUtilisateur> findAvecCompetence(@Param("utilisateurId") Long utilisateurId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from CompetenceUtilisateur cu where cu.utilisateur.id = :utilisateurId")
    void supprimerParUtilisateur(@Param("utilisateurId") Long utilisateurId);

    @Query("select cu from CompetenceUtilisateur cu join fetch cu.competence where cu.utilisateur.id in :ids")
    List<CompetenceUtilisateur> findParUtilisateurs(@Param("ids") Collection<Long> ids);

    // Les compétences des développeurs qui pourraient rejoindre un projet (hors membres et demandes en attente)
    @Query("select cu from CompetenceUtilisateur cu join fetch cu.competence join fetch cu.utilisateur u "
            + "where u.actif = true "
            + "and u.id not in (select m.utilisateur.id from MembreProjet m where m.projet.id = :projetId) "
            + "and u.id not in (select d.demandeur.id from DemandeAdhesion d where d.projet.id = :projetId "
            + "and d.statut = com.cadev.backend.enumeration.StatutDemande.EN_ATTENTE)"
            + "and u.id not in (select i.invite.id from InvitationProjet i where i.projet.id = :projetId "
            + "and i.statut = com.cadev.backend.enumeration.StatutInvitation.EN_ATTENTE)")
    List<CompetenceUtilisateur> findCandidatsPourProjet(@Param("projetId") Long projetId);

    // Les compétences des autres développeurs sur certaines compétences (échanges)
    @Query("select cu from CompetenceUtilisateur cu join fetch cu.competence join fetch cu.utilisateur u "
            + "where u.actif = true and u.id <> :moi and cu.competence.id in :ids")
    List<CompetenceUtilisateur> findAutresPourCompetences(@Param("moi") Long moi,
                                                          @Param("ids") Collection<Long> ids);


}