# Jobalso Frontend

Application Next.js (App Router) + Tailwind CSS pour la plateforme de recrutement Jobalso, avec deux espaces (Candidat / Recruteur) et un parcours de candidature public sans compte.

## Prérequis
- Docker Desktop installé et lancé
- Le backend Jobalso doit tourner (voir son propre README) : ce frontend appelle son API sur `http://localhost:8000`

## Installation

1. Cloner le repo et se placer dans le dossier
```bash
   git clone <url-du-repo>
   cd jobalso-frontend
```

2. Lancer la stack
```bash
   docker-compose up -d --build
```
   `NEXT_PUBLIC_API_URL` est fixée au moment du build (elle est inlinée dans le code envoyé au navigateur). Sa valeur par défaut, `http://localhost:8000`, convient pour un usage local. Pour la changer, passer `NEXT_PUBLIC_API_URL=...` en variable d'environnement avant `docker-compose up -d --build`, puis reconstruire.

3. Ouvrir http://localhost:3000

⚠️ Le frontend tourne en **build de production** dans Docker (pas de rechargement à chaud) : après toute modification du code, il faut reconstruire l'image avec `docker-compose up -d --build`.

## Pages principales

| Page | Rôle |
|---|---|
| `/` | Accueil, choix Candidat / Recruteur |
| `/connexion`, `/inscription` | Authentification (email + mot de passe) |
| `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe` | Réinitialisation du mot de passe (JA-004) |
| `/persona-recruteur` | Sélection du profil recruteur avant connexion/inscription |
| `/cv` | Espace candidat : gestion du CV, code CV à partager |
| `/candidatures` | Espace candidat : suivi des candidatures et de leur statut (JA-059) |
| `/offres` | Espace recruteur : liste des offres publiées |
| `/offres/nouvelle` | Espace recruteur : création d'une offre |
| `/offres/[id]` | Détail d'une offre : évaluation de CV par code, changement de statut des candidatures (JA-056), lien de candidature publique à partager |
| `/postuler/[id]` | Page publique de candidature sans compte (JA-027), accessible via le lien partagé depuis `/offres/[id]` |
| `/politique-confidentialite` | Politique de confidentialité (JA-009) |

## Commandes utiles

Voir les logs en direct
```bash
docker logs jobalso_frontend -f
```

Reconstruire après une modification de code
```bash
docker-compose up -d --build
```

Arrêter
```bash
docker-compose down
```

## Développement sans Docker (optionnel)

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000. Dans ce mode, le rechargement à chaud est actif ; s'assurer que le backend tourne bien sur `http://localhost:8000` (ou adapter `NEXT_PUBLIC_API_URL` dans un fichier `.env.local`).
