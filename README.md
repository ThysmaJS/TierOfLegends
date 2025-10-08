# Tier of Legends 🏆

Bienvenue sur **Tier of Legends**, une application web interactive permettant de créer et partager des tier lists des skins de League of Legends !

## 🎮 Description du projet

Tier of Legends est une plateforme web développée avec Next.js qui permet aux joueurs de League of Legends de :

- **Créer des tier lists** personnalisées des skins de leurs champions favoris
- **Classer les skins** selon leurs préférences (S, A, B, C, D tiers)
- **Explorer** tous les skins disponibles grâce à l'API officielle de Riot Games
- **Partager** leurs tier lists avec la communauté

## 🚀 Technologies utilisées

- **Next.js 15** - Framework React pour le développement web
- **TypeScript** - Pour un code plus robuste et maintenable
- **Tailwind CSS** - Framework CSS pour un design moderne
- **Riot Games API** - Pour récupérer les données officielles des champions et skins

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- Node.js (version 18 ou supérieure)
- npm, yarn, pnpm ou bun

## ⚡ Installation et lancement

1. **Clonez le repository** :
```bash
git clone <votre-repo-url>
cd tier-of-legends
```

2. **Installez les dépendances** :
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Lancez le serveur de développement** :
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

4. **Ouvrez votre navigateur** et accédez à [http://localhost:3000](http://localhost:3000)

## 🔗 API Reference

Ce projet utilise l'API officielle de Riot Games pour récupérer les données des champions et skins :

- **Documentation officielle** : [https://developer.riotgames.com/docs/lol](https://developer.riotgames.com/docs/lol)
- **Endpoints utilisés** :
  - Champions : `/lol/static-data/v3/champions`
  - Skins : Données intégrées dans les informations des champions

## 🎨 Fonctionnalités

- [ ] Affichage de tous les champions League of Legends
- [ ] Visualisation des skins de chaque champion
- [ ] Interface drag & drop pour créer des tier lists
- [ ] Sauvegarde locale des tier lists
- [ ] Partage des tier lists créées

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou proposer une pull request.

## 📄 License

Ce projet est développé dans un cadre éducatif. Les assets et données League of Legends appartiennent à Riot Games.
