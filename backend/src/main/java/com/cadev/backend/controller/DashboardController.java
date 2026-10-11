package com.cadev.backend.controller;

import com.cadev.backend.dto.sortie.DashboardDto;
import com.cadev.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardDto dashboard(Authentication auth) {
        return service.construire(auth.getName());
    }
}

