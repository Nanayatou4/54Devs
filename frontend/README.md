# 54Devs — Front (React + Vite)

Interface de la plateforme 54Devs (concours CADEV). Elle consomme l'API Spring Boot du dossier `backend/`.

## Installation

```bash
npm install
cp .env.example .env   # puis renseigner les variables
npm run dev            # http://localhost:5173
```

## Variables d'environnement (`.env`)

| Variable | Rôle |
|---|---|
| `VITE_API_BASE_URL` | URL de l'API, par exemple `http://localhost:8087/api` |
| `VITE_APP_ORIGIN` | URL publique du front (retour OAuth) |
| `VITE_GITHUB_CLIENT_ID` | Client ID GitHub OAuth (public) |
| `VITE_GOOGLE_CLIENT_ID` | Client ID Google OAuth (public) |

Ces variables sont figées au moment du `npm run build` : pour un déploiement, renseigner les adresses publiques avant de construire. Côté back, `CORS_ORIGIN` doit pointer vers l'adresse publique du front.

## Scripts

- `npm run dev` : serveur de développement
- `npm run build` : build de production (`dist/`)
- `npm run lint` : vérification oxlint

## Organisation

- `src/api/` : client HTTP unique (`client.js`) et un fichier par ressource, alignés sur le contrat d'API
- `src/lib/libelles.js` : libellés français des valeurs d'énumération de l'API
- `src/pages/`, `src/components/` : écrans et composants
