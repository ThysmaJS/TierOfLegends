# Tier of Legends 🏆

Plateforme Next.js (FR) pour créer, classer et partager des tier lists autour de League of Legends: skins de champions, objets, sorts d’invocateur et runes.

## ✨ Aperçu

- Crée des tier lists avec drag & drop (tiers S à E)
- Catégories disponibles: skins par champion, items (filtres type/mode), summoner spells, runes (keystones)
- Sauvegarde en base (MongoDB), profil utilisateur (avatar, email, pseudo), routes protégées
- Données Riot Data Dragon en français (images optimisées via `next/image`), cache de données Next.js
- Recherche côté client (Redux Toolkit), pages SEO (robots, sitemap), i18n FR
- Tests end-to-end avec Playwright (smoke test fourni)

## 🧱 Stack technique

- Next.js 15 (App Router) + React 18 + TypeScript
- Tailwind CSS v4
- NextAuth (authentification credentials/JWT)
- MongoDB Node Driver (connexion server-only)
- Redux Toolkit + React-Redux (état UI: filtres)
- Zod (validation des payloads API)
- Playwright (tests e2e)

## 📂 Structure (extrait)

```
src/
  app/
    (pages)…
    api/
      champions/         # /api/champions, /api/champions/[id]
      categories/        # /api/categories/[category]
      tierlists/         # /api/tierlists (+ [id], mine)
      profile/           # /api/profile (+ avatar, email)
      auth/[...nextauth] # NextAuth
    a-propos/
    error.tsx           # error boundary
    not-found.tsx       # 404
    robots.ts / sitemap.ts
  components/
  lib/riot.ts           # accès DDragon + wrappers de cache
  lib/mongodb.ts        # helper MongoDB (server-only)
  i18n/
  store/                # Redux
middleware.ts           # protection /profil, /tier-lists/new
```

## 🔐 Variables d’environnement

Voir `.env.example` et créer un `.env.local` (non versionné). Minimum:

- `NEXTAUTH_URL` — URL du site (ex: http://localhost:3000)
- `NEXTAUTH_SECRET` — secret NextAuth (ex: `openssl rand -base64 32`)
- `MONGODB_URI` — connexion MongoDB (Atlas recommandé)

Les `.env*` sont gitignorés.

## 🚀 Démarrage

1) Installer les dépendances

```bash
npm install
```

2) Lancer en dev

```bash
npm run dev
```

3) Build prod puis start

```bash
npm run build
npm run start
```

Scripts utiles:

- `npm run lint` — ESLint
- `npm run clean` — supprime `.next/`
- `npm run dev:turbo` — dev avec Turbopack

## 🧪 Tests (Playwright)

1) Installer les navigateurs Playwright (une fois):

```bash
npx playwright install
```

2) Lancer l’app puis les tests:

```bash
npm run dev
npm run test:e2e:headed
```

Autres scripts: `test:e2e`, `test:e2e:ui`. Pour une URL différente: `PLAYWRIGHT_BASE_URL`.

## 🗄️ Base de données

- MongoDB (Atlas). Connexion côté serveur (server-only) via `src/lib/mongodb.ts`.
- Création de comptes: `/api/register` (Zod + messages d’erreurs structurés).
- Tier lists: CRUD via `/api/tierlists` (création validée par Zod, erreurs propres).
- Profil: `/api/profile` (pseudo, avatarUrl), `/api/profile/email`, `/api/profile/avatar`.

## 🔌 API interne (exemples)

- `GET /api/champions` — liste (fr_FR)
- `GET /api/champions/[id]` — détails + skins (fr_FR)
- `GET /api/categories/[category]` — items/spells/runes/skins deck
  - Query items: `type=final|component|boots|consumable|trinket`, `map=sr|aram`
- `GET /api/tierlists` — global
- `POST /api/tierlists` — création (auth requise, Zod; erreurs `{ fieldErrors, formErrors }`)
- `GET /api/tierlists/mine` — mes listes (auth)

## ⚡ Cache & images

- DDragon encapsulé dans `src/lib/riot.ts` avec wrappers `unstable_cache` (revalidate ~1h, tags: `ddragon:*`).
- Homepage revalidate: 10 minutes.
- Images `next/image` avec remote patterns autorisés.

## 🔒 Auth & sécurité

- NextAuth (credentials + JWT). Extraction du token côté API (fiable en prod / Vercel).
- Middleware protège `/profil` et `/tier-lists/new` (redirige vers `/login?next=…`).
- Secrets et connexion DB non exposés au client.

## 🌐 SEO & i18n

- `robots.txt`, `sitemap.xml`, 404 personnalisée; `<html lang="fr">`.
- Dictionnaire i18n FR (`src/i18n/dictionaries/fr.json`) + helper (`getDictionary`).

## 🧭 Fonctionnalités principales

- Drag & drop (react-tierlist), tiers S→E
- Catégories basées sur DDragon (FR): skins, items (filtres), spells, runes
- Modales d’infos (objets/sorts/runes), images HQ (splash/loading)
- Recherche client (Redux) sur la page listing
- Erreurs formulaires propres (inline + bandeau) grâce aux retours Zod

## 📦 Déploiement

- Vercel recommandé. Définir `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `MONGODB_URI` dans les variables du projet.
- Certaines routes nécessitent runtime Node (App Router par défaut pour handlers).
