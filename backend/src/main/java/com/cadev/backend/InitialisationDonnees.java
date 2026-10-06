package com.cadev.backend;

import com.cadev.backend.entite.Competence;
import com.cadev.backend.repository.CompetenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitialisationDonnees implements CommandLineRunner {

    private final CompetenceRepository competences;

    @Override
    public void run(String... args) {
        if (competences.count() > 0) {
            return;
        }
        List<Competence> liste = new ArrayList<>();
        ajouter(liste, "Backend", "Java", "Spring Boot", "Node.js", "Python", "PHP", "Laravel", "C# / .NET", "SQL");
        ajouter(liste, "Frontend", "Angular", "React", "Vue.js", "TypeScript", "JavaScript", "HTML/CSS");
        ajouter(liste, "Base de données", "PostgreSQL", "MySQL", "MongoDB");
        ajouter(liste, "DevOps", "Docker", "Kubernetes", "CI/CD", "Linux", "Git");
        ajouter(liste, "Mobile", "Flutter", "Android", "React Native");
        ajouter(liste, "Design", "UI/UX", "Figma");
        ajouter(liste, "Données et IA", "Machine Learning", "Data Science", "NLP");
        ajouter(liste, "Sécurité", "Cybersécurité");
        competences.saveAll(liste);
    }

    private void ajouter(List<Competence> liste, String categorie, String... noms) {
        for (String nom : noms) {
            Competence c = new Competence();
            c.setNom(nom);
            c.setCategorie(categorie);
            liste.add(c);
        }
    }
}