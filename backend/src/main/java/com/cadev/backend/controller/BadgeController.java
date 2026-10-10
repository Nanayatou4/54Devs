package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.BadgeDto;
import com.cadev.backend.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService service;

    @GetMapping
    public List<BadgeDto> mesBadges(Authentication auth) {
        return service.catalogue(auth.getName());
    }
}
