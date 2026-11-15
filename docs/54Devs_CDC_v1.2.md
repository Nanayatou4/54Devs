# 54Devs
## Cahier des charges fonctionnel
### Plateforme africaine d'échange, de collaboration et de construction pour les développeurs

**CADEV 2026 — Version 1.2 — Novembre 2026**

> Positionnement : Un écosystème africain où les développeurs peuvent apprendre, partager leurs compétences, trouver les bonnes personnes, former des équipes et transformer leurs idées en projets réels.

---

## 1. Informations générales

| Élément | Information |
|---|---|
| **Nom du produit** | 54Devs |
| **Compétition** | Coupe d'Afrique des Développeurs (CADEV) 2026 |
| **Organisateur** | Systalink |
| **Nature** | Plateforme web collaborative dédiée aux développeurs africains |
| **Version du document** | 1.2 (mise à jour post-développement) |
| **Date** | Novembre 2026 |
| **Équipe** | Soumy Devs — Anna Soumayatou Diena & Oumy Dieng 🇸🇳 |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 |
| **Backend** | Java 17 / Spring Boot 3 / Spring Security / JWT / REST API |
| **Base de données** | PostgreSQL |
| **Versionnement** | Git / GitHub — https://github.com/Nanayatou4/54Devs |
| **Déploiement** | Render.com (frontend + backend) + Nom de domaine Systalink |
| **URL de démonstration** | https://five4devs-frontend.onrender.com |

### Accès jury (connexion directe)

| Rôle | Email | Mot de passe |
|---|---|---|
| 👤 Développeur | awafall@gmail.com | awafall1 |
| 🛡️ Administrateur | adminmaya@gmail.com | adminmaya |

> **Note jury :** Des boutons de connexion rapide « 1 clic » sont intégrés directement sur la page de connexion pour faciliter la démonstration.

---

## 2. Contexte et problématique

Les développeurs africains disposent de compétences, d'idées et de projets, mais les moyens permettant de trouver rapidement des collaborateurs complémentaires, de partager leurs connaissances et de construire ensemble restent souvent dispersés entre plusieurs plateformes.

54Devs répond à cette problématique en réunissant dans un même écosystème les profils de développeurs, les compétences, les projets, la collaboration, les questions/réponses, le mentorat, les challenges et compétitions, et la valorisation des contributions.

**Problématique centrale :** comment permettre à un développeur de passer plus facilement d'une compétence ou d'une idée à une collaboration concrète et à la réalisation d'un projet ?

---

## 3. Vision, mission et proposition de valeur

### 3.1 Vision
Faire de 54Devs un espace de référence où les développeurs africains peuvent se retrouver, apprendre, partager, collaborer et construire des projets au-delà des frontières.

> **Vision produit :** un développeur ne devrait pas abandonner une idée simplement parce qu'il ne possède pas seul toutes les compétences nécessaires pour la réaliser.

### 3.2 Mission
Faciliter la rencontre entre compétences, idées et personnes afin de transformer les capacités individuelles en force collective.

### 3.3 Proposition de valeur
**Learn. Share. Connect. Build.**

Construire ensemble, apprendre ensemble et faire grandir les compétences des développeurs africains.

---

## 4. Objectifs du produit

### 4.1 Objectif général
Créer une plateforme collaborative permettant aux développeurs africains de découvrir des personnes et des projets pertinents, d'échanger leurs connaissances, de former des équipes et de contribuer à des projets réels.

### 4.2 Objectifs spécifiques
- Permettre à chaque développeur de présenter clairement ses compétences, intérêts, disponibilités et objectifs.
- Faciliter la découverte de projets et la constitution d'équipes.
- Mettre en relation les besoins des projets avec les compétences disponibles.
- Permettre les échanges techniques au moyen de questions/réponses.
- Faciliter le mentorat et l'apprentissage entre développeurs.
- Proposer des mini-challenges et des compétitions (solo et en équipe) permettant de progresser et de pratiquer.
- Valoriser les contributions réelles au moyen d'un système de réputation et de badges.
- Créer une expérience africaine et transfrontalière de collaboration entre développeurs.

---

## 5. Utilisateurs cibles

- Étudiants en informatique et jeunes diplômés.
- Développeurs débutants, intermédiaires et expérimentés.
- Freelances et développeurs intéressés par l'open source.
- Porteurs de projets techniques recherchant des compétences.
- Mentors souhaitant transmettre leurs connaissances.
- Participants à des hackathons et initiatives technologiques africaines.

Les profils peuvent provenir de différents pays africains afin de favoriser les collaborations au-delà des frontières.

---

## 6. Architecture fonctionnelle

Le produit est organisé autour de modules complémentaires. Le cœur de la plateforme repose sur le triptyque **Profil/Compétences → Matching/Projet → Équipe/Collaboration**, renforcé par l'apprentissage, la compétition et la réputation.

| Module | Finalité |
|---|---|
| Authentification & onboarding | Créer un compte, se connecter, sécuriser l'accès et initialiser le profil. |
| Profil & compétences | Présenter l'identité technique, les compétences, les objectifs et les disponibilités. |
| Projets | Publier, découvrir, rechercher et gérer des projets collaboratifs. |
| Matching | Recommander des projets ou des développeurs selon les besoins et compatibilités. |
| Équipe & espace projet | Gérer les membres, les discussions et l'engagement d'équipe. |
| Questions / réponses | Poser, rechercher et résoudre des questions techniques. |
| Mentorat | Mettre en relation mentors et mentorés et suivre les séances. |
| Mini-Challenges | Proposer des défis techniques courts et suivre les participations. |
| **Compétitions & Arène** *(nouveau)* | Organiser des compétitions solo (Sprint Hebdomadaire) et hackathons en équipe (Mensuel) avec soumission GitHub et évaluation jury. |
| Réputation & badges | Valoriser les contributions et la progression. |
| Notifications | Informer les utilisateurs des événements qui les concernent. |
| Administration & modération | Administrer les utilisateurs, contenus, signalements, challenges, compétitions et statistiques. |

---

## 7. Spécifications fonctionnelles

### 7.1 Authentification et onboarding
- Inscription d'un utilisateur.
- Connexion et déconnexion.
- Gestion sécurisée du mot de passe (BCrypt).
- Attribution et contrôle des rôles (USER, ADMIN).
- Protection des ressources selon les autorisations (Spring Security + JWT).
- Initialisation du profil après inscription.
- **Connexion rapide jury :** boutons de connexion pré-remplis pour la démonstration (1 clic).

### 7.2 Profil développeur et compétences
Le profil constitue le centre de l'identité technique de l'utilisateur.
- Informations : nom ou pseudonyme, pays, ville, bio et niveau.
- Liens professionnels : GitHub, LinkedIn et portfolio.
- Compétences et technologies maîtrisées.
- Compétences à apprendre et compétences pouvant être enseignées.
- Disponibilité et types de collaboration recherchés.
- Projets et contributions visibles sur le profil.
- Badges et réputation.

### 7.3 Projets
- Créer un projet.
- Modifier et gérer son projet.
- Consulter les projets.
- Rechercher et filtrer les projets.
- Consulter les détails d'un projet.
- Définir les technologies et compétences recherchées.
- Définir les rôles recherchés (texte libre) et le nombre total de personnes recherchées.
- Définir, de façon facultative, les conditions d'engagement du projet.
- Définir le statut : Idée, En développement, En cours de lancement, Terminé ou En pause.
- Demander à rejoindre un projet (hors projet terminé ou complet).
- Gérer les demandes d'adhésion : acceptation ou refus par le créateur.
- Participer à 2 projets non terminés au maximum (RG15).

### 7.4 Collaboration et matching
Le matching constitue un mécanisme différenciant de 54Devs. Il peut fonctionner dans les deux sens :
- **Développeur → projets** susceptibles de correspondre à ses compétences et objectifs.
- **Projet → développeurs** susceptibles de répondre aux besoins de l'équipe.

Le score de compatibilité est calculé à partir des compétences déclarées par le `MatchingService` backend (`MatchingService.java`), prenant en compte les compétences maîtrisées, à apprendre et à enseigner, croisées avec les besoins du projet.

### 7.5 Équipe et espace projet
- Consulter l'espace d'un projet, réservé aux membres du projet.
- Gérer les membres et leurs rôles.
- Quitter un projet, ou en retirer un membre, en indiquant un motif.
- Participer aux discussions du projet.
- **Engagement d'équipe :** lors de sa demande d'adhésion, le candidat prend connaissance des conditions d'engagement du projet et accepte de s'engager à y contribuer ; la date d'acceptation est conservée.

### 7.6 Questions et réponses
- Poser une question technique.
- Consulter et rechercher les questions.
- Répondre à une question.
- Modifier son contenu.
- Marquer une réponse comme solution.
- Signaler un contenu inapproprié.

Sujets couverts : Java, JavaScript, Angular, React, Spring, DevOps, Cloud, IA, bases de données, sécurité, architecture et mobile.

### 7.7 Mentorat
- Rechercher un mentor par domaine ou technologie.
- Consulter le profil d'un mentor.
- Demander un mentorat.
- Gérer une relation de mentorat.
- Planifier une séance.
- Participer à une séance.
- Rédiger et consulter un compte rendu.
- Réaliser un bilan du mentorat.

### 7.8 Mini-Challenges
- Consulter et rechercher les challenges.
- Consulter le détail d'un challenge.
- Participer à un challenge (quiz de code).
- Soumettre une solution via un éditeur de code intégré (terminal-style).
- Consulter les résultats et le classement.

Les challenges peuvent porter sur le debugging, l'algorithmique, l'architecture, la sécurité ou l'analyse de technologies.

### 7.9 Compétitions & Arène *(module nouveau — implémenté)*

Le module Compétitions propose trois espaces distincts accessibles via l'interface unifiée « Compétitions & Arène » :

#### ⚡ Sprint Solo Hebdomadaire
- Compétition individuelle à durée limitée (1 semaine).
- Chaque développeur soumet un lien GitHub de son projet/solution.
- Le jury évalue la soumission et attribue un score + retour d'évaluation.
- Statut de la soumission : En attente / Évalué.

#### 👥 Hackathon Team Mensuel
- Compétition en équipe, format hackathon (1 mois).
- Les équipes soumettent un dépôt GitHub collaboratif.
- Le jury dispose d'une interface d'évaluation dédiée (console jury).
- Score, retour et statut d'évaluation visibles par l'équipe.

#### 🏛️ Hall of Fame
- Vitrine des projets primés et équipes lauréates.
- Affiche les scores, technologies utilisées et liens vers les dépôts GitHub.

**Modèle de données backend :**
- Entité `Competition` avec `TypeCompetition` enum (`SOLO`, `EQUIPE`).
- Entité `SoumissionCompetition` : `urlDepot` (lien GitHub), `score`, `retourEvaluation`, `evaluee` (flag booléen), `dateEvaluation`.

### 7.10 Réputation, contributions et badges
La réputation valorise les actions utiles à la communauté.
- Enregistrer les contributions significatives d'un utilisateur.
- Calculer ou mettre à jour la réputation à partir des contributions.
- **Attribution automatique** de badges lorsque les conditions sont remplies (`BadgeService.java`).
- Permettre à l'administrateur de gérer les badges.
- Afficher les contributions et badges sur le profil.

**Badges disponibles :** Problem Solver, Collaborateur, Mentor, Challenge Master, Knowledge Sharer, Builder, Rising Developer.

### 7.11 Notifications
- Notification lorsqu'une personne demande à rejoindre un projet.
- Notification lors d'une réponse à une question.
- Notification lors de l'acceptation d'une réponse comme solution.
- Notification liée à une demande ou une acceptation de mentorat.
- Notification liée à un projet ou une collaboration.
- Notification lors de la disponibilité d'un nouveau challenge ou d'une compétition.
- Consultation et marquage des notifications comme lues.

### 7.12 Recherche et exploration
- Recherche de développeurs par compétence, technologie, pays, niveau et disponibilité.
- Recherche de projets par technologie, domaine, statut et compétences recherchées.
- Recherche de questions par technologie, catégorie et pertinence/popularité.
- Recherche de mentors par domaine, technologie et expérience.

### 7.13 Administration et modération

Le tableau de bord administrateur est organisé en sous-onglets :

#### Onglet Challenges — Sous-onglet Mini-Challenges
- Créer, modifier et supprimer des mini-challenges.
- Éditeur de code intégré (terminal-style) pour définir le code de référence.
- Aperçu de la réponse attendue en temps réel.
- Gestion des soumissions utilisateurs.

#### Onglet Challenges — Sous-onglet Compétitions & Hackathons *(nouveau)*
- Créer, modifier et supprimer des compétitions (solo ou équipe).
- Visualiser les soumissions avec statut, score et lien GitHub.
- **Console jury :** évaluer les soumissions directement depuis l'interface admin — saisie du score (0–100), retour d'évaluation textuel, ouverture du dépôt GitHub en un clic.

#### Autres onglets administrateur
- Gestion des utilisateurs.
- Modération des projets et des questions/réponses.
- Gestion des signalements.
- Gestion des badges.
- Consultation des statistiques de la plateforme.

---

## 8. Principales règles de gestion

| Code | Règle |
|---|---|
| RG01 | Un utilisateur doit être authentifié pour accéder aux fonctionnalités privées de la plateforme. |
| RG02 | Les actions disponibles dépendent du rôle et des autorisations de l'utilisateur. |
| RG03 | Un projet possède un créateur responsable de sa gestion. |
| RG04 | Un utilisateur peut demander à rejoindre un projet ; la demande est traitée par le créateur du projet. |
| RG05 | L'appartenance à un projet peut être associée à un rôle et à une date d'adhésion. |
| RG06 | Les compétences d'un utilisateur peuvent être déclarées comme maîtrisées, à apprendre ou à enseigner. |
| RG07 | Les compétences recherchées par un projet peuvent préciser un niveau attendu et leur caractère obligatoire. |
| RG08 | Une question peut recevoir plusieurs réponses, dont une peut être désignée comme solution. |
| RG09 | Les badges sont attribués automatiquement sur la base de critères de contribution définis par la plateforme. |
| RG10 | Les notifications sont personnelles et ne sont visibles que par leur destinataire. |
| RG11 | Les contenus signalés peuvent faire l'objet d'une modération administrative. |
| RG12 | Le nombre de personnes recherchées par un projet ne compte pas son créateur (5 personnes = équipe de 6 max). |
| RG13 | Un projet terminé ou complet n'accepte plus de demandes d'adhésion. |
| RG14 | L'espace d'un projet (discussions) est réservé à ses membres. |
| RG15 | Un utilisateur ne peut pas participer à plus de 2 projets non terminés en même temps, créateur compris. |
| RG16 | Un candidat doit accepter l'engagement du projet pour demander à le rejoindre ; tout départ d'un membre doit être motivé. |
| RG17 *(nouveau)* | Une soumission de compétition est liée à un utilisateur (Solo) ou à une équipe (Équipe) ; elle ne peut être évaluée que par un administrateur. |
| RG18 *(nouveau)* | Le score d'une compétition est compris entre 0 et 100 ; le retour d'évaluation est obligatoire à la notation. |

---

## 9. Parcours utilisateur principal

```
Inscription → Création du profil → Déclaration des compétences →
Découverte → Projet / Question / Challenge / Compétition / Mentor →
Collaboration ou apprentissage → Contributions → Réputation et badges
```

**Parcours central démontrable :**
1. Créer un compte et se connecter.
2. Compléter son profil développeur.
3. Déclarer ses compétences et ce qu'il souhaite apprendre.
4. Découvrir un projet correspondant à ses intérêts (via matching).
5. Consulter les compétences recherchées.
6. Demander à rejoindre l'équipe, en acceptant l'engagement du projet.
7. Le créateur accepte la demande.
8. Le membre rejoint l'équipe et accède à l'espace projet.
9. Les membres échangent et contribuent au projet.
10. L'utilisateur peut également répondre à une question, participer à un mini-challenge ou s'inscrire à une compétition.
11. Ses contributions alimentent sa réputation et l'obtention de badges.

**Parcours Compétitions & Arène :**
1. L'utilisateur consulte les compétitions disponibles (onglet ⚡ ou 👥).
2. Il soumet son projet via un lien GitHub.
3. Le jury (admin) ouvre la console d'évaluation, vérifie le dépôt et attribue un score + retour.
4. L'utilisateur voit son résultat dans son tableau de bord.
5. Les meilleurs projets rejoignent le Hall of Fame 🏛️.

---

## 10. Exigences UX/UI

- Interface moderne, professionnelle et dynamique — thème sombre (dark theme).
- Identité africaine contemporaine et subtile (palette de couleurs, typographie).
- Navigation claire entre les espaces Connect, Learn, Build et Arène.
- **Responsive desktop et mobile** : l'interface s'adapte à toutes tailles d'écran.
- États de chargement, états vides et états d'erreur prévus.
- Feedback utilisateur clair après les actions importantes (badges de statut, toasts).
- Hiérarchie visuelle permettant de comprendre rapidement la valeur de la plateforme.
- **Splash intro** : écran d'accueil animé mettant en valeur l'identité africaine de la plateforme.
- **Lecteur audio ambiant** : player de musique africaine ambiant, désactivé par défaut, activable au choix par l'utilisateur (pas d'autoplay).
- Le dashboard constitue la porte d'entrée dynamique de la communauté.

---

## 11. Modèle de données — vue conceptuelle

Les principales entités fonctionnelles implémentées sont :

**Utilisateur • Profil • Compétence • CompétenceUtilisateur • Projet • CompétenceProjet • MembreProjet • DemandeAdhésion • DépartProjet • DiscussionProjet • Question • Réponse • Mentorat • SéanceMentorat • Challenge • ParticipationChallenge • Contribution • Badge • BadgeUtilisateur • Notification • Signalement • Competition • SoumissionCompetition**

Les résultats de matching ne sont pas persistés : ils sont calculés à la volée à partir des profils, compétences, projets et critères de compatibilité (`MatchingService.java`).

---

## 12. Architecture technique

| Couche | Choix retenu |
|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS v4 |
| **Backend** | Java 17 + Spring Boot 3 |
| **API** | REST (JSON) |
| **Sécurité** | Spring Security + JWT + BCrypt |
| **Persistance** | Spring Data JPA / Hibernate |
| **Base de données** | PostgreSQL |
| **Validation** | Jakarta Validation (backend) + validation côté frontend |
| **Versionnement** | Git / GitHub |
| **Déploiement** | Render.com (backend Web Service + frontend Static Site) |
| **Monitoring** | UptimeRobot (keep-alive du backend Render) |
| **Nom de domaine** | Systalink (en cours de validation) |
| **Containerisation** | Docker Compose (développement local) |

---

## 13. Sécurité et protection

- Authentification sécurisée par JWT (JSON Web Tokens).
- Mots de passe stockés sous forme hashée (BCrypt) — jamais en clair.
- Contrôle d'accès basé sur les rôles et autorisations (ROLE_USER, ROLE_ADMIN).
- Validation des données entrantes (Jakarta Validation).
- Protection des endpoints sensibles (Spring Security).
- Gestion des contenus et signalements pour limiter les abus.
- Séparation des responsabilités entre frontend et backend.
- Aucun secret (clé JWT, mots de passe de base de données) dans le dépôt Git : configuration par variables d'environnement.

---

## 14. Intelligence artificielle

L'IA est envisagée comme une capacité différenciante. Son usage prioritaire est le matching intelligent.

- **Dans la version CADEV :** le matching est un calcul de compatibilité algorithmique à partir des compétences déclarées (`MatchingService.java`), sans modèle d'IA externe.
- **Roadmap :** IA avancée pour le matching intelligent, suggestion de collaborateurs, et assistance à la formulation des besoins.

L'usage d'outils d'IA pour le développement est déclaré lors de la soumission, conformément au règlement de la compétition.

---

## 15. Périmètre CADEV — MVP livré

### 15.1 Fonctionnalités prioritaires — ✅ Implémentées

- ✅ Inscription et connexion (JWT + Spring Security)
- ✅ Connexion rapide jury (boutons 1 clic sur la page de login)
- ✅ Profil développeur complet
- ✅ Gestion des compétences (maîtrisées / à apprendre / à enseigner)
- ✅ Création et consultation de projets
- ✅ Recherche et découverte de projets
- ✅ Recherche de développeurs
- ✅ Demandes pour rejoindre un projet, avec acceptation de l'engagement d'équipe
- ✅ Gestion des membres d'un projet
- ✅ Espace projet et collaboration de base (discussions membres)
- ✅ Questions / réponses
- ✅ Mini-Challenges (éditeur code, soumission, classement)
- ✅ **Compétitions & Arène** (Sprint Solo + Hackathon Team + Hall of Fame)
- ✅ Badges et système de contributions (auto-attribution)
- ✅ Dashboard personnalisé
- ✅ Tableau de bord administrateur complet (gestion challenges + compétitions)
- ✅ Console jury pour évaluation des soumissions

### 15.2 Fonctionnalités différenciantes — ✅ Implémentées

- ✅ Matching par compétences (score de compatibilité — `MatchingService.java`)
- ✅ Mentorat (demande, suivi, séances)
- ✅ Échange de compétences

### 15.3 Fonctionnalités intégrées en cours de CADEV *(ajouts v1.2)*

- ✅ Interface responsive desktop et mobile
- ✅ Splash intro animé (identité africaine)
- ✅ Lecteur audio ambiant africain (opt-in, sans autoplay)
- ✅ Hall of Fame des compétitions
- ✅ Navigation unifiée « Compétitions & Arène »
- ✅ Admin Dashboard à double sous-onglet (Mini-Challenges | Compétitions & Hackathons)

### 15.4 Évolutions post-CADEV

- Messagerie privée et temps réel (WebSocket).
- IA avancée (matching intelligent par modèle).
- Visioconférence.
- Groupes et communautés spécialisées.
- Événements et calendriers.
- Intégrations GitHub et GitLab (webhooks).
- Système de réputation avancé.
- Application mobile (PWA ou native).

---

## 16. Scénario de démonstration

**Scénario cible :** montrer qu'une idée peut rapidement devenir une collaboration concrète, et qu'un développeur peut s'engager dans la compétition africaine.

### Parcours collaboration
1. Un développeur crée son compte (ou utilise le bouton jury 1 clic).
2. Il complète son profil et ses compétences.
3. Il consulte des projets correspondant à ses intérêts (matching).
4. Il ouvre un projet et visualise le problème, la solution, les technologies et les compétences recherchées.
5. Il demande à rejoindre le projet en acceptant l'engagement d'équipe.
6. Le créateur accepte la demande.
7. Le nouveau membre apparaît dans l'équipe.
8. L'équipe accède à son espace projet et commence à collaborer.
9. L'utilisateur répond à une question ou participe à un challenge.
10. Ses contributions sont valorisées par la réputation et les badges.

### Parcours compétition (nouveau)
1. L'admin se connecte (bouton 1 clic 🛡️ Administrateur).
2. Il crée une compétition Solo ou Équipe depuis l'onglet « Compétitions & Hackathons ».
3. Le développeur s'inscrit et soumet son lien GitHub.
4. L'admin évalue depuis la console jury : score + retour.
5. Le résultat apparaît sur le profil du développeur et dans le Hall of Fame.

---

## 17. Déploiement et conformité CADEV

- Le produit est accessible en ligne : **https://five4devs-frontend.onrender.com**
- Le projet utilise un service commercial Systalink (nom de domaine acquis — en attente de validation DNS).
- Le dépôt Git constitue le support de versionnement : **https://github.com/Nanayatou4/54Devs**
- L'utilisation d'outils d'IA est déclarée à la soumission (outils utilisés : Antigravity / Google Gemini pour assistance au développement).
- Les composants tiers sont sous licence permissive (MIT, Apache 2.0) : React, Spring Boot, Tailwind CSS, Lucide React, etc.
- Monitoring de disponibilité : UptimeRobot (keep-alive Render).

---

## 18. Critères de réussite

Le projet est considéré comme réussi si un nouvel utilisateur comprend rapidement la valeur de 54Devs et peut réaliser sans friction le parcours principal :

> « Je veux construire quelque chose → j'ai besoin de personnes → je les trouve → nous collaborons. »

- ✅ La proposition de valeur est immédiatement compréhensible (Splash intro + Landing).
- ✅ Le parcours profil → compétences → projet → équipe est fonctionnel.
- ✅ Les interactions principales sont cohérentes et sécurisées (JWT, rôles).
- ✅ La démonstration en ligne est stable (Render + UptimeRobot).
- ✅ L'interface présente un niveau de finition professionnel (dark theme, responsive).
- ✅ Les fonctionnalités différenciantes sont compréhensibles et démontrables (matching, compétitions, console jury).

---

## 19. Positionnement et différenciation

54Devs ne se positionne pas comme un simple réseau social professionnel pour développeurs. Sa valeur réside dans la combinaison de plusieurs mécanismes :

> **Projets + Compétences + Matching + Collaboration + Apprentissage + Compétitions + Contribution**

L'objectif est de réduire la distance entre une idée, les compétences nécessaires et la formation d'une équipe capable de construire réellement le projet — dans un contexte africain et panafricain.

---

## 20. Roadmap produit

| Phase | Objectif |
|---|---|
| **Phase 1 — CADEV** *(livré)* | MVP cohérent, sécurisé, déployé et démontrable : profil, compétences, projets, équipes, questions/réponses, mini-challenges, compétitions, matching, mentorat, badges, admin. |
| **Phase 2 — Enrichissement** | Notifications structurées en temps réel, messagerie privée, engagement d'équipe enrichi (contrat détaillé), espace projet enrichi (tâches). |
| **Phase 3 — Écosystème** | IA avancée, visioconférence, groupes et communautés, événements, intégrations GitHub/GitLab, système de réputation avancé, application mobile. |

---

## 21. Conclusion

54Devs ambitionne de créer un espace où les développeurs africains ne se contentent pas de montrer ce qu'ils savent faire, mais peuvent trouver les personnes, les connaissances et les opportunités nécessaires pour construire ensemble.

**Philosophie :** une idée ne devrait pas mourir parce qu'une personne ne possède pas toutes les compétences nécessaires pour la réaliser.

54Devs transforme ainsi les compétences individuelles en force collective, avec une ambition claire : connecter les développeurs africains et faciliter le passage de l'apprentissage à la collaboration, puis de la collaboration à la construction.

---

*54Devs — Cahier des charges fonctionnel — CADEV 2026 — Version 1.2 — Novembre 2026*
*Équipe Soumy Devs : Anna Soumayatou Diena & Oumy Dieng 🇸🇳*
*GitHub : https://github.com/Nanayatou4/54Devs | Demo : https://five4devs-frontend.onrender.com*
