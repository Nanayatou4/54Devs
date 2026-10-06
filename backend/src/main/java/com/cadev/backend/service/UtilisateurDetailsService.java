package com.cadev.backend.service;

import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UtilisateurDetailsService implements UserDetailsService {
    private final UtilisateurRepository utilisateurs;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur u = utilisateurs.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));
        return User
                .withUsername(u.getEmail())
                .password(u.getMotDePasse())
                .roles(u.getRole().name()) // ROLE_UTILISATEUR ou ROLE_ADMIN
                .disabled(!u.isActif())
                .build();
    }

}
