package com.cadev.backend.repository;

import com.cadev.backend.entite.InvitationProjet;
import com.cadev.backend.enumeration.StatutInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvitationProjetRepository extends JpaRepository<InvitationProjet, Long> {

    boolean existsByProjetIdAndInviteIdAndStatut(Long projetId, Long inviteId, StatutInvitation statut);

    long countByProjetIdAndStatut(Long projetId, StatutInvitation statut);

    long countByInviteIdAndStatut(Long inviteId, StatutInvitation statut);

    Optional<InvitationProjet> findFirstByProjetIdAndInviteIdOrderByDateInvitationDesc(Long projetId, Long inviteId);

    @Query("select i from InvitationProjet i join fetch i.invite u left join fetch u.profil "
            + "where i.projet.id = :projetId order by i.dateInvitation desc")
    List<InvitationProjet> findEnvoyees(@Param("projetId") Long projetId);

    @Query("select i from InvitationProjet i join fetch i.projet p join fetch p.createur c left join fetch c.profil "
            + "where i.invite.id = :inviteId order by i.dateInvitation desc")
    List<InvitationProjet> findRecues(@Param("inviteId") Long inviteId);

    @Query("select i from InvitationProjet i join fetch i.projet p join fetch p.createur "
            + "join fetch i.invite where i.id = :id")
    Optional<InvitationProjet> findAvecDetails(@Param("id") Long id);
}