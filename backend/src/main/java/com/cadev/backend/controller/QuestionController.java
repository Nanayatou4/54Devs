package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.QuestionRequete;
import com.cadev.backend.dto.entree.ReponseRequete;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.dto.sortie.QuestionDetailDto;
import com.cadev.backend.dto.sortie.QuestionResumeDto;
import com.cadev.backend.dto.sortie.ReponseDto;
import com.cadev.backend.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionDetailDto creer(Authentication auth, @Valid @RequestBody QuestionRequete requete) {
        return service.creer(auth.getName(), requete);
    }

    @GetMapping
    public PageDto<QuestionResumeDto> rechercher(
            @RequestParam(required = false) String texte,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) Boolean resolue,
            @RequestParam(defaultValue = "recentes") String tri,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int taille) {
        return service.rechercher(texte, categorie, resolue, tri, page, taille);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return service.categories();
    }

    @GetMapping("/{id}")
    public QuestionDetailDto detail(Authentication auth, @PathVariable Long id) {
        return service.detail(id, auth.getName());
    }

    @PutMapping("/{id}")
    public QuestionDetailDto modifier(Authentication auth, @PathVariable Long id,
                                      @Valid @RequestBody QuestionRequete requete) {
        return service.modifier(id, auth.getName(), requete);
    }

    @PostMapping("/{id}/reponses")
    @ResponseStatus(HttpStatus.CREATED)
    public ReponseDto repondre(Authentication auth, @PathVariable Long id,
                               @Valid @RequestBody ReponseRequete requete) {
        return service.repondre(id, auth.getName(), requete);
    }

    @PutMapping("/{id}/reponses/{reponseId}")
    public ReponseDto modifierReponse(Authentication auth, @PathVariable Long id, @PathVariable Long reponseId,
                                      @Valid @RequestBody ReponseRequete requete) {
        return service.modifierReponse(id, reponseId, auth.getName(), requete);
    }

    @PatchMapping("/{id}/reponses/{reponseId}/solution")
    public ReponseDto marquerSolution(Authentication auth, @PathVariable Long id, @PathVariable Long reponseId) {
        return service.marquerSolution(id, reponseId, auth.getName());
    }
}
