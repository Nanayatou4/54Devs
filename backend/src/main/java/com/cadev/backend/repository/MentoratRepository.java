package com.cadev.backend.repository;

import com.cadev.backend.entite.Mentorat;
import com.cadev.backend.enumeration.StatutMentorat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MentoratRepository extends JpaRepository<Mentorat, Long> {

    long countByMentorIdAndStatut(Long mentorId, StatutMentorat statut);

    boolean existsByMentorIdAndMentoreIdAndStatutIn(Long mentorId, Long mentoreId, Collection<StatutMentorat> statuts);

    @Query("select m from Mentorat m join fetch m.mentor mt join fetch m.mentore me "
            + "left join fetch mt.profil left join fetch me.profil where m.id = :id")
    Optional<Mentorat> findAvecParticipants(@Param("id") Long id);

    @Query("select m from Mentorat m join fetch m.mentor mt join fetch m.mentore me "
            + "left join fetch mt.profil left join fetch me.profil where mt.id = :id order by m.dateDemande desc")
    List<Mentorat> findCommeMentor(@Param("id") Long id);

    @Query("select m from Mentorat m join fetch m.mentor mt join fetch m.mentore me "
            + "left join fetch mt.profil left join fetch me.profil where me.id = :id order by m.dateDemande desc")
    List<Mentorat> findCommeMentore(@Param("id") Long id);

    @Query("select m.mentor.id, count(m) from Mentorat m where m.mentor.id in :ids "
            + "and m.statut = com.cadev.backend.enumeration.StatutMentorat.ACCEPTE group by m.mentor.id")
    List<Object[]> compterActifsParMentor(@Param("ids") Collection<Long> ids);
}
