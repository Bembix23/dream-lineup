# DREAM LINEUP ⚽

## *Document à lire impérativement pour installer le projet*

Dream Lineup est une application web permettant de composer et gérer son équipe de football idéale.  
Elle s’appuie sur **React** pour le front-end, **NestJS** pour le back-end, et **Firebase** pour l’authentification et la sauvegarde des données.  
Les données des joueurs et équipes proviennent de l’API [football-data.org](https://www.football-data.org/).

## 🚀 Fonctionnalités principales

- Connexion et authentification via Firebase
- Choix du système de jeu (4-4-2, 4-2-3-1, etc.)
- Ajout de joueurs par poste avec tri par poste
- Sauvegarde de la composition via Firebase

## ⚙️ Prérequis
Avant de commencer, assurez-vous d’avoir installé :
- [Node.js (v18+)](https://nodejs.org/)
- [npm](https://www.npmjs.com)
- [Git](https://git-scm.com)

## 📦 Installation et lancement du projet

### 1. Cloner le dépôt
```bash
git clone https://github.com/Bembix23/dream-lineup.git
cd dream-lineup 
```

### 2. Lancer le back-end (NestJS)

````
cd backend
npm install
````

Pour obtenir l'APIKEY, vous pouvez rapidement et simplement vous créer un compte sur le site du fournisseur [football-data.org](https://www.football-data.org/client/register). Vous retrouverez cette clé dans les données personnelles du compte. 

Créer un fichier `.env` dans le dossier `backend/` avec la clé fournie par l'API de données de football:

````
FOOTBALL_DATA_API_KEY=xxx
````

Vous pouvez ensuite démarrer le serveur:

````
npm run start:dev
````

Le backend tourne sur http://localhost:4000.

### 3. Lancer le front-end (React)

````
cd ../frontend
npm install
npm run start
````

Le front tourne sur http://localhost:3000.

Pour le front-end il n'y a pas besoin de créer un `.env` car la configuration Firebase se situe dans `src/firebase.js`.

## 🧪 Tests

### Backend

````
cd backend
npm test
````

### Frontend

````
cd frontend
npm test
````

