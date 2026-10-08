package com.cadev.backend.dto;

import com.cadev.backend.dto.sortie.UtilisateurDto;

public record ReponseAuth(String token, UtilisateurDto utilisateur) {
}
