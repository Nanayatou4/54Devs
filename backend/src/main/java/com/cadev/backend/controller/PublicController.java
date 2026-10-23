package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.DeveloppeurResumeDto;
import com.cadev.backend.dto.sortie.MentorResumeDto;
import com.cadev.backend.dto.sortie.ProjetPublicDto;
import com.cadev.backend.dto.sortie.StatistiquesPubliquesDto;
import com.cadev.backend.repository.ChallengeRepository;
import com.cadev.backend.repository.ProjetRepository;
import com.cadev.backend.repository.QuestionRepository;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.DeveloppeurService;
import com.cadev.backend.service.MentorService;
import com.cadev.backend.service.ProjetPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ProjetPublicService projetPublicService;
    private final ProjetRepository projetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final QuestionRepository questionRepository;
    private final ChallengeRepository challengeRepository;
    private final MentorService mentorService;
    private final DeveloppeurService developpeurService;

    @GetMapping("/projets")
    public ResponseEntity<List<ProjetPublicDto>> projets(@RequestParam(defaultValue = "6") int limite) {
        int borne = Math.min(Math.max(limite, 1), 12);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(1)).cachePublic())
                .body(projetPublicService.recents(borne));
    }

    @GetMapping("/statistiques")
    public ResponseEntity<StatistiquesPubliquesDto> statistiques() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic())
                .body(new StatistiquesPubliquesDto(
                        projetRepository.count(), utilisateurRepository.countByActifTrue(),
                        questionRepository.count(), challengeRepository.count()));
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<MentorResumeDto>> mentors(@RequestParam(defaultValue = "12") int limite) {
        int borne = Math.min(Math.max(limite, 1), 50);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(1)).cachePublic())
                .body(mentorService.rechercher(null, null, null, null, null, 0, borne).contenu());
    }

    @GetMapping("/developpeurs")
    public ResponseEntity<List<DeveloppeurResumeDto>> developpeurs(@RequestParam(defaultValue = "100") int limite) {
        int borne = Math.min(Math.max(limite, 1), 100);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(1)).cachePublic())
                .body(developpeurService.rechercher(null, null, null, null, null, null, null, 0, borne).contenu());
    }
}
