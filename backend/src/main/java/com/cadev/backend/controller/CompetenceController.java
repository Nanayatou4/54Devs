package com.cadev.backend.controller;

import com.cadev.backend.dto.CompetenceDto;
import com.cadev.backend.entite.Competence;
import com.cadev.backend.repository.CompetenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}