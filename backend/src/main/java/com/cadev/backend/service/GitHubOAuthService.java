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

@Service
@RequiredArgsConstructor
public class GitHubOAuthService {

    private final UtilisateurRepository utilisateurs;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    @Value("${app.github.client-id}")
    private String clientId;

    @Value("${app.github.client-secret}")
    private String clientSecret;

    @Transactional
    public ReponseAuth authentifierAvecGitHub(String code) {
        String accessToken = echangerCodePourToken(code);
        JsonNode profil = recupererProfilGitHub(accessToken);
        String email = recupererEmailGitHub(accessToken);

        String githubId = String.valueOf(profil.get("id").asLong());
        String nom = extraireNom(profil);
        String prenom = extrairePrenom(profil);

        Utilisateur u = utilisateurs.findByGithubId(githubId)
                .or(() -> utilisateurs.findByEmail(email))
                .orElse(null);

        if (u == null) {
            u = new Utilisateur();
            u.setEmail(email);
            u.setNom(nom);
            u.setPrenom(prenom);
            u.setGithubId(githubId);

            Profil p = new Profil();
            p.setUtilisateur(u);
            p.setPseudo(prenom);
            u.setProfil(p);

            utilisateurs.save(u);
        } else if (u.getGithubId() == null) {
            u.setGithubId(githubId);
            utilisateurs.save(u);
        }

        return new ReponseAuth(jwtService.generateToken(u.getEmail()), UtilisateurDto.depuis(u));
    }

    private String echangerCodePourToken(String code) {
        try {
            String body = objectMapper.writeValueAsString(new TokenRequest(clientId, clientSecret, code));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://github.com/login/oauth/access_token"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode json = objectMapper.readTree(response.body());
            if (json.has("error")) {
                throw new RuntimeException("GitHub OAuth error: " + json.get("error_description").asText());
            }
            return json.get("access_token").asText();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'échange du code GitHub", e);
        }
    }

    private JsonNode recupererProfilGitHub(String accessToken) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/user"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            return objectMapper.readTree(response.body());
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération du profil GitHub", e);
        }
    }

    private String recupererEmailGitHub(String accessToken) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/user/emails"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode emails = objectMapper.readTree(response.body());
            for (JsonNode emailNode : emails) {
                if (emailNode.get("primary").asBoolean() && emailNode.get("verified").asBoolean()) {
                    return emailNode.get("email").asText();
                }
            }
            for (JsonNode emailNode : emails) {
                if (emailNode.get("primary").asBoolean()) {
                    return emailNode.get("email").asText();
                }
            }
            throw new RuntimeException("Aucun email trouvé sur le compte GitHub");
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération de l'email GitHub", e);
        }
    }

    private String extrairePrenom(JsonNode profil) {
        String name = profil.has("name") && !profil.get("name").isNull()
                ? profil.get("name").asText() : profil.get("login").asText();
        String[] parts = name.split(" ", 2);
        return parts[0];
    }

    private String extraireNom(JsonNode profil) {
        String name = profil.has("name") && !profil.get("name").isNull()
                ? profil.get("name").asText() : profil.get("login").asText();
        String[] parts = name.split(" ", 2);
        return parts.length > 1 ? parts[1] : parts[0];
    }

    private record TokenRequest(String client_id, String client_secret, String code) {}
}
