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
                .password(u.getMotDePasse() != null ? u.getMotDePasse() : "{noop}__oauth__")
                .roles(u.getRole().name())
                .disabled(!u.isActif())
                .build();
    }

}
