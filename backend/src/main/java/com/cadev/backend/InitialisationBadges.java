package com.cadev.backend;

import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitialisationBadges implements CommandLineRunner {

    private final BadgeService badgeService;
    private final UtilisateurRepository utilisateurs;

    @Override
    public void run(String... args) {
        badgeService.synchroniserCatalogue();
        // Rattrape les utilisateurs qui remplissent déjà les conditions (données créées avant ce module)
        utilisateurs.findAll().forEach(u -> badgeService.evaluer(u.getId()));
    }
}
