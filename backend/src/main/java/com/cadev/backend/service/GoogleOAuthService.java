package com.cadev.backend.service;

import com.cadev.backend.dto.ReponseAuth;
import com.cadev.backend.dto.sortie.UtilisateurDto;
import com.cadev.backend.entite.Profil;
import com.cadev.backend.entite.Utilisateur;
import com.cadev.backend.repository.UtilisateurRepository;
import com.cadev.backend.securite.JwtService;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final UtilisateurRepository utilisateurs;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    @Value("${app.google.client-id}")
    private String clientId;

    @Value("${app.google.client-secret}")
    private String clientSecret;

    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
    private static final String REDIRECT_URI = "http://localhost:5173/auth/callback/google";

    @Transactional
    public ReponseAuth authentifierAvecGoogle(String code) {
        String accessToken = echangerCodePourToken(code);
        JsonNode userInfo = recupererProfilGoogle(accessToken);

        String googleId = userInfo.get("id").asText();
        String email = userInfo.get("email").asText();
        String prenom = userInfo.has("given_name") ? userInfo.get("given_name").asText() : email.split("@")[0];
        String nom = userInfo.has("family_name") ? userInfo.get("family_name").asText() : prenom;

        Utilisateur u = utilisateurs.findByGoogleId(googleId)
                .or(() -> utilisateurs.findByEmail(email))
                .orElse(null);

        if (u == null) {
            u = new Utilisateur();
            u.setEmail(email);
            u.setNom(nom);
            u.setPrenom(prenom);
            u.setGoogleId(googleId);

            Profil p = new Profil();
            p.setUtilisateur(u);
            p.setPseudo(prenom);
            u.setProfil(p);

            utilisateurs.save(u);
        } else if (u.getGoogleId() == null) {
            u.setGoogleId(googleId);
            utilisateurs.save(u);
        }

        return new ReponseAuth(jwtService.generateToken(u.getEmail()), UtilisateurDto.depuis(u));
    }

    private String echangerCodePourToken(String code) {
        try {
            String formBody = "code=" + URLEncoder.encode(code, StandardCharsets.UTF_8)
                    + "&client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8)
                    + "&client_secret=" + URLEncoder.encode(clientSecret, StandardCharsets.UTF_8)
                    + "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI, StandardCharsets.UTF_8)
                    + "&grant_type=authorization_code";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(TOKEN_URL))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(formBody))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode json = objectMapper.readTree(response.body());
            if (json.has("error")) {
                String desc = json.has("error_description") ? json.get("error_description").asText() : json.get("error").asText();
                throw new RuntimeException("Google OAuth error: " + desc);
            }
            return json.get("access_token").asText();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'échange du code Google", e);
        }
    }

    private JsonNode recupererProfilGoogle(String accessToken) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(USERINFO_URL))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            return objectMapper.readTree(response.body());
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération du profil Google", e);
        }
    }
}
