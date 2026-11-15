<div align="center">

# 🌍 54DEVS
### Le Hub Technologique des 54 Nations Africaines
**Plateforme collaborative panafricaine d'échange, d'appariement de projets et de mentorat pour les développeurs**

Projet développé dans le cadre de la **Coupe d'Afrique des Développeurs (CADEV)** — *Systalink Challenge 2026*  
**Équipe : Soumy Devs** 🇸🇳 (*Anna Soumayatou Diena & Oumy Dieng*)

[![Démo en ligne](https://img.shields.io/badge/Démo%20en%20ligne-Render-C9F06A?style=for-the-badge&logo=render&logoColor=black)](https://five4devs-frontend.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Nanayatou4/54Devs)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

---

</div>

## 📌 Présentation & Vision

Les développeurs africains regorgent de talents et d'idées novatrices, mais sont trop souvent freinés par l'isolement géographique, la difficulté à trouver des coéquipiers complémentaires et le manque de mentorat structuré. De nombreux projets prometteurs meurent prématurément par dispersion ou abandon.

**54DEVS** brise ces frontières en connectant les talents des **54 pays du continent africain**. C'est une plateforme d'action où le code unit l'Afrique, favorise la souveraineté technologique collective et propulse des projets open-source et entrepreneuriaux à fort impact local.

---

## ⚡ Fonctionnalités Clés

### 🎯 1. Smart Match (Algorithme d'Appariement Intelligent)
- **Calcul de compatibilité en temps réel** entre les compétences maîtrisées d'un développeur, ce qu'il souhaite apprendre, et les besoins précis d'un projet.
- **Échange de compétences bidirectionnel** pour assurer un apprentissage mutuel au sein de l'équipe.

### 🛡️ 2. Charte d'Engagement & Règle des 2 Projets Max
- Pour éviter la dispersion et garantir un taux d'achèvement élevé, **chaque développeur est limité à 2 projets actifs simultanés**.
- Valorisation de la rigueur et de la responsabilité collective.

### 🎓 3. Mentorat Structuré Panafricain
- Répertoire de mentors expérimentés avec fiches détaillées et disponibilités.
- Demande de mentorat encadrée, planification de séances en visioconférence et **comptes-rendus obligatoires** pour mesurer la progression réelle.

### 🏆 4. Défis & Compétitions
- **Mini-challenges techniques** : exercices de débogage, algorithmique, cybersécurité, architecture et enjeux africains.
- Évaluation automatique, attribution de points et classement général en temps réel.
- **Compétitions & Hackathons** intégrés avec soumission de dépôts.

### 🌍 5. Carte Interactive & Réseau Panafricain
- Exploration des talents et initiatives à travers les **54 États africains**.
- Mise en valeur de la diversité linguistique, technique et sectorielle (AgriTech, FinTech, Santé, Énergie, Éducation).

### 🎖️ 6. Gamification & Badges de Reconnaissance
- Attribution dynamique de badges basés sur les réalisations concrètes :
  - `Problem Solver` (entraide communautaire validée)
  - `Collaborateur` (implication multi-projets)
  - `Builder` (projets menés à terme)
  - `Challenge Master` & `Rising Developer`

### 💬 7. Espaces Projets & Entraide Communautaire
- Discussion interne par projet, gestion des candidatures d'adhésion et invitations directes.
- Forum public de questions/réponses technique avec validation de la meilleure réponse.

---

## 🛠️ Stack Technique

### Backend
- **Langage** : Java 21 LTS
- **Framework** : Spring Boot 3
- **Sécurité** : Spring Security + Authentification par JWT (JSON Web Tokens) & OAuth2 (Google / GitHub)
- **Persistance** : Spring Data JPA, Hibernate, PostgreSQL / MySQL
- **Architecture** : RESTful API, DTOs découplés, Specifications dynamiques, Services transactionnels

### Frontend
- **Framework** : React 19 + Vite
- **Styling** : Tailwind CSS v4 (thème personnalisé Dark Jungle `#101915` et Neon Lime `#C9F06A`)
- **Composants & Icônes** : Lucide React, Glassmorphism UI
- **Visualisations & 3D** : Three.js, Canvas interactifs, TopoJSON

### DevOps & Infrastructure
- **Conteneurisation** : Docker, Docker Compose multi-services
- **Serveur Web Frontend** : Nginx Alpine
- **Hébergement** : Render.com (Backend API + Frontend SPA)
- **Monitoring** : Health endpoints & keep-alive UptimeRobot

---

## 🚀 Accès & Démo

- 🌐 **Application déployée** : [https://five4devs-frontend.onrender.com](https://five4devs-frontend.onrender.com)
- 📂 **Dépôt GitHub** : [https://github.com/Nanayatou4/54Devs](https://github.com/Nanayatou4/54Devs)

> **Note pour l'évaluation :** Vous pouvez explorer la plateforme librement, créer un compte ou vous connecter pour tester le Smart Match, postuler à des projets et résoudre des défis.

---

## 💻 Démarrage Local

### Prérequis
- Docker & Docker Compose **OU** Java 21, Maven 3.9+, Node.js 20+

### Option 1 : Avec Docker Compose (Recommandé)
```bash
# 1. Cloner le dépôt
git clone https://github.com/Nanayatou4/54Devs.git
cd 54Devs

# 2. Configurer l'environnement
cp .env.example .env

# 3. Lancer l'ensemble des conteneurs
docker-compose up --build
```
L'application est accessible sur :
- Frontend : `http://localhost:8080`
- API Backend : `http://localhost:8087/api`

---

### Option 2 : Lancement Manuel

#### Backend :
```bash
cd backend
./mvnw clean spring-boot:run
```

#### Frontend :
```bash
cd frontend
npm install
npm run dev
```

---

## 👥 Équipe — Soumy Devs

- **Anna Soumayatou Diena** — *Développement Fullstack & Architecture*
- **Oumy Dieng** — *Développement Frontend & UI/UX*

*Développé avec passion pour l'Afrique et la communauté des bâtisseurs tech.* 🌍✨
