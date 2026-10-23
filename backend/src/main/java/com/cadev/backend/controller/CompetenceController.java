package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.CompetenceDto;
import com.cadev.backend.entite.Competence;
import com.cadev.backend.exception.RequeteInvalideException;
import com.cadev.backend.repository.CompetenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/competences")
@RequiredArgsConstructor
public class CompetenceController {

    private final CompetenceRepository competences;

    @GetMapping
    public List<CompetenceDto> lister(@RequestParam(required = false) String categorie) {
        List<Competence> resultat = (categorie == null || categorie.isBlank())
                ? competences.findAll(Sort.by("nom"))
                : competences.findByCategorieIgnoreCaseOrderByNomAsc(categorie.trim());
        return resultat.stream().map(CompetenceDto::depuis).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CompetenceDto creerOuObtenir(@RequestBody Map<String, String> body) {
        String nom = body.get("nom");
        if (nom == null || nom.trim().isBlank()) {
            throw new RequeteInvalideException("Le nom de la compétence est obligatoire");
        }
        String nomPropre = nom.trim();
        Competence c = competences.findByNomIgnoreCase(nomPropre)
                .orElseGet(() -> {
                    Competence nouvelle = new Competence();
                    nouvelle.setNom(nomPropre);
                    nouvelle.setCategorie(body.getOrDefault("categorie", "Autre"));
                    return competences.save(nouvelle);
                });
        return CompetenceDto.depuis(c);
    }
}
