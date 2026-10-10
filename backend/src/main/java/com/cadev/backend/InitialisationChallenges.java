package com.cadev.backend;

import com.cadev.backend.entite.Challenge;
import com.cadev.backend.enumeration.DifficulteChallenge;
import com.cadev.backend.enumeration.TypeChallenge;
import com.cadev.backend.repository.ChallengeRepository;
import com.cadev.backend.service.ChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitialisationChallenges implements CommandLineRunner {

    private final ChallengeRepository challenges;

    @Override
    public void run(String... args) {
        if (challenges.count() > 0) {
            return;
        }
        LocalDate debut = LocalDate.now(ZoneId.of("Africa/Dakar"));
        LocalDate fin = debut.plusDays(90);

        challenges.saveAll(List.of(
                creer(TypeChallenge.DEBUG, DifficulteChallenge.FACILE, "Le total qui ne s'affiche pas",
                        "Cette fonction doit calculer la somme d'une liste de nombres. Que affiche exactement console.log(compter([1, 2, 3])) ?",
                        """
                        function compter(liste) {
                          let total = 0;
                          for (let i = 0; i <= liste.length; i++) {
                            total += liste[i];
                          }
                          return total;
                        }
                        """, "javascript", "NaN",
                        "La boucle va jusqu'à i <= liste.length : à la dernière itération, liste[3] vaut undefined, et 6 + undefined donne NaN. Il faut écrire i < liste.length.",
                        debut, fin),

                creer(TypeChallenge.DEBUG, DifficulteChallenge.MOYEN, "La liste qui se souvient",
                        "Que affiche le deuxième appel, print(ajouter(2)) ? Écrivez le résultat exact.",
                        """
                        def ajouter(element, liste=[]):
                            liste.append(element)
                            return liste
        
                        print(ajouter(1))
                        print(ajouter(2))
                        """, "python", "[1, 2]|[1,2]",
                        "La valeur par défaut liste=[] est créée une seule fois, à la définition de la fonction, puis partagée entre les appels. Solution : liste=None, puis « if liste is None: liste = [] ».",
                        debut, fin),

                creer(TypeChallenge.ALGORITHME, DifficulteChallenge.FACILE, "La somme des chiffres",
                        "Quelle est la somme des chiffres du nombre 2 puissance 15 ?",
                        null, null, "26",
                        "2^15 = 32 768, et 3 + 2 + 7 + 6 + 8 = 26.",
                        debut, fin),

                creer(TypeChallenge.ALGORITHME, DifficulteChallenge.MOYEN, "Combien de Fizz ?",
                        "Dans un FizzBuzz de 1 à 100 (Fizz pour les multiples de 3, Buzz pour les multiples de 5, FizzBuzz pour les multiples des deux), combien de fois le mot « Fizz » seul est-il affiché ?",
                        null, null, "27",
                        "Il y a 33 multiples de 3 jusqu'à 100, dont 6 sont aussi multiples de 15 (15, 30, 45, 60, 75, 90) : 33 - 6 = 27.",
                        debut, fin),

                creer(TypeChallenge.SECURITE, DifficulteChallenge.MOYEN, "Identifier la vulnérabilité",
                        "Cette requête SQL est construite en concaténant des valeurs saisies par l'utilisateur. Quel nom porte cette vulnérabilité ?",
                        """
                        String sql = "SELECT * FROM utilisateurs WHERE email = '" + email
                                   + "' AND mot_de_passe = '" + motDePasse + "'";
                        ResultSet resultat = connexion.createStatement().executeQuery(sql);
                        """, "java", "injection sql|sql injection|sqli|injection de sql",
                        "Une saisie comme ' OR '1'='1 change le sens de la requête. On se protège avec des requêtes préparées (PreparedStatement) ou avec Spring Data JPA et des paramètres nommés.",
                        debut, fin),

                creer(TypeChallenge.TECHNOLOGIE, DifficulteChallenge.FACILE, "401 ou 403 ?",
                        "Dans une API REST, un utilisateur est bien connecté (son token est valide) mais tente de modifier le projet d'une autre personne. Quel code de statut HTTP doit répondre l'API ? (trois chiffres)",
                        null, null, "403|403 forbidden",
                        "401 signifie « non authentifié » (token absent ou invalide). 403 signifie « authentifié, mais pas autorisé ».",
                        debut, fin),

                creer(TypeChallenge.ARCHITECTURE, DifficulteChallenge.FACILE, "Où mettre la règle métier ?",
                        "Dans une application Spring en trois couches (controller, service, repository), dans quelle couche doit se trouver une règle métier comme « un projet complet n'accepte plus de demandes » ?",
                        null, null, "service|la couche service|couche service|le service|services",
                        "Le controller traduit seulement le HTTP, le repository accède seulement aux données : la logique métier va dans la couche service, qui se teste sans HTTP ni base de données.",
                        debut, fin),

                creer(TypeChallenge.AFRIQUE, DifficulteChallenge.MOYEN, "Le double débit du mobile money",
                        "Dans une application de paiement mobile (Orange Money, Wave, MTN MoMo...), le réseau coupe au moment du paiement et le client appuie plusieurs fois sur « Payer ». Comment appelle-t-on la propriété d'une opération qui, rejouée plusieurs fois, produit le même résultat qu'une seule fois, et qui évite un double débit ? (un mot)",
                        null, null, "idempotence|idempotent|idempotente",
                        "Une opération idempotente peut être répétée sans effet supplémentaire. En pratique, le client envoie une clé unique par paiement et le serveur ignore les doublons de cette clé.",
                        debut, fin)
        ));
    }

    private Challenge creer(TypeChallenge type, DifficulteChallenge difficulte, String titre, String enonce,
                            String extraitCode, String langage, String reponses, String explication,
                            LocalDate debut, LocalDate fin) {
        Challenge c = new Challenge();
        c.setType(type);
        c.setDifficulte(difficulte);
        c.setPoints(ChallengeService.pointsPour(difficulte));
        c.setTitre(titre);
        c.setEnonce(enonce);
        c.setExtraitCode(extraitCode);
        c.setLangage(langage);
        c.setReponsesAcceptees(reponses);
        c.setExplication(explication);
        c.setNombreEssaisMax(3);
        c.setDateDebut(debut);
        c.setDateFin(fin);
        return c;
    }
}
