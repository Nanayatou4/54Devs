package com.cadev.backend.controller;

import com.cadev.backend.dto.entree.ChallengeRequete;
import com.cadev.backend.dto.sortie.AdminChallengeDto;
import com.cadev.backend.dto.sortie.ChallengeDetailDto;
import com.cadev.backend.dto.sortie.PageDto;
import com.cadev.backend.service.AdminService;
import com.cadev.backend.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/challenges")
@RequiredArgsConstructor
public class AdminChallengeController {

    private final ChallengeService service;
    private final AdminService adminService;

    @GetMapping
    public PageDto<AdminChallengeDto> lister(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int taille) {
        return adminService.challenges(page, taille);
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeDetailDto creer(Authentication auth, @Valid @RequestBody ChallengeRequete requete) {
        return service.creer(auth.getName(), requete);
    }
}