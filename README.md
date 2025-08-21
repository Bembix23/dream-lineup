
# DREAM LINEUP ⚽

  

## *Document à lire impérativement pour installer le projet*

  

Dream Lineup est une application web permettant de composer et gérer son équipe de football idéale.

Elle s'appuie sur **React** pour le front-end, **NestJS** pour le back-end, et **Firebase** pour l'authentification et la sauvegarde des données.

Les données des joueurs et équipes proviennent de l'API [football-data.org](https://www.football-data.org/).

  

## 🚀 Fonctionnalités principales

  

- Connexion et authentification via Firebase

- Choix du système de jeu (4-4-2, 4-2-3-1, etc.)

- Ajout de joueurs par poste avec tri par poste

- Sauvegarde de la composition via Firebase

  

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js (v18+)](https://nodejs.org/)

- [npm](https://www.npmjs.com)

- [Git](https://git-scm.com)

  

## 📦 Installation et lancement du projet

  

### 🔥 Configuration Firebase (optionnelle pour démo)

Pour utiliser pleinement l'application avec sauvegarde, vous devez configurer Firebase :

  

#### 1. Créer un projet Firebase

1. Aller sur https://console.firebase.google.com

2. Cliquer "Créer un projet" → Nommer le projet

3. Activer Google Analytics (optionnel) → Créer le projet

  

#### 2. Configurer Firestore

1. Dans la console Firebase → "Firestore Database"

2. Cliquer "Créer une base de données"

3. Choisir "Commencer en mode test" → Sélectionner une région

  

#### 3. Créer un service account (Backend)

1. Aller dans "Paramètres du projet" (⚙️) → "Comptes de service"

2. Cliquer "Générer une nouvelle clé privée"

3. Télécharger le fichier JSON

  

#### 4. Configuration Frontend Firebase

1. Dans "Paramètres du projet" → "Général" → "Vos applications"

2. Cliquer l'icône web (</>) → Nommer l'app

3. Copier la configuration (firebaseConfig)

4. Remplacer dans `frontend/src/firebase.js` :

  

```javascript

const  firebaseConfig  = {

apiKey: "votre-api-key",

authDomain: "votre-projet.firebaseapp.com",

projectId: "votre-projet-id",

storageBucket: "votre-projet.appspot.com",

messagingSenderId: "123456789",

appId: "votre-app-id"

};

```

  

### 1. Cloner le dépôt

```bash

git clone  https://github.com/Bembix23/dream-lineup.git

cd dream-lineup

```

  

### 2. Lancer le back-end (NestJS)

  

```bash

cd backend

npm install

```

  

#### Configuration API Football-data

Pour obtenir l'APIKEY, vous pouvez rapidement et simplement vous créer un compte sur le site du fournisseur [football-data.org](https://www.football-data.org/client/register). Vous retrouverez cette clé dans les données personnelles du compte.

  

Créer un fichier `.env` dans le dossier `backend/` :

  

```bash

# API Football (obligatoire)

FOOTBALL_DATA_API_KEY=votre_api_key_ici

```

  

**Firebase:**

```bash

# Si vous avez le fichier JSON, exécutez les commandes suivantes :

export  FIREBASE_SERVICE_ACCOUNT_JSON="$(cat chemin/vers/votre-cle.json)"

npm run start:dev

```

  

Le backend tourne sur http://localhost:4000.

  

### 3. Lancer le front-end (React)

  

```bash

cd  ../frontend

npm install

npm run start

```

  

Le front tourne sur http://localhost:3000.

  

## 🧪 Mode démo (sans Firebase)

  

Si vous ne configurez pas Firebase :

- ✅ **Navigation** : Fonctionne

- ✅ **Sélection de joueurs** : Fonctionne

- ✅ **Création d'équipes** : Fonctionne

- ❌ **Connexion utilisateur** : Désactivée

- ❌ **Sauvegarde d'équipes** : Désactivée

  

L'application reste entièrement fonctionnelle pour démonstration !

  

## 🔒 Sécurité

  

Cette application implémente les standards de sécurité OWASP Top 10 2021.

Voir [README-SECURITY.md](./README-SECURITY.md) pour le rapport complet.

  

**Score sécurité : 8/10 EXCELLENT** 🛡️

  

## 🧪 Tests

  

### Backend

```bash

cd backend

npm test

```

  

### Frontend

```bash

cd frontend

npm test

```

  

### Tests de sécurité

```bash

cd backend

./audit-security-fast.sh  # Audit vulnérabilités

./pentest-security.sh  # Tests de pénétration

```  

---

  

*Développé par Jules DUPUIS - Projet sécurisé selon OWASP Top 10 2021*