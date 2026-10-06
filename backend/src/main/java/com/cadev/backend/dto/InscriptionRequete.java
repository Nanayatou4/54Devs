package com.cadev.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InscriptionRequete(
        @NotBlank String nom,
        @NotBlank String prenom,
        @Email
        @NotBlank String email,
        @NotBlank @Size(min = 8, message = "8 caractères minimum") String motDePasse, String pays){ }
