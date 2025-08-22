
# DREAM LINEUP ⚽

Lien Github : [Dream Lineup](https://github.com/Bembix23/dream-lineup.git)


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

#### 2. Configurer l'authentification

1. Dans la console Firebase → "Authentication"

2. Cliquer sur "Créer"

3. Sélectionner "Email/Mot de Passe" puis cocher sur la popup, valider.

#### 3. Configurer Firestore

1. Dans la console Firebase → "Firestore Database"

2. Cliquer "Créer une base de données"

3. Choisir "Commencer en mode test" → Sélectionner une région

  

#### 4. Créer un service account (Backend)

1. Aller dans "Paramètres du projet" (⚙️) → "Comptes de service"

2. Cliquer "Générer une nouvelle clé privée"

3. Télécharger le fichier JSON

4. Renommer le fichier "firebase-key.json"

5. Mettre le fichier dans le dossier Bureau/config/dream-lineup

  

#### 5. Configuration Frontend Firebase

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

# Si vous avez le fichier JSON(sur MAC), exécutez les commandes suivantes :

export  FIREBASE_SERVICE_ACCOUNT_JSON="$(cat chemin/vers/votre-cle.json)"

npm run start:dev

```

```bash

# Si vous avez le fichier JSON(sur Windows), exécutez les commandes suivantes :

$env:FIREBASE_SERVICE_ACCOUNT_JSON = Get-Content chemin/vers/votre-cle.json -Raw

npm run start:dev

```

Attention! Après avoir exécuté cette commande, la variable fonctionne dans la session, s'il y a cloture du terminal ou de l'IDE, il faudra la refaire pour que Firebase soit opérationnel.

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

Les tests de service ont été simplifiés pour éviter les conflits de mocks Firebase dans l'environnement Jest.

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

./audit-security.sh  # Audit vulnérabilités

./pentest-security.sh  # Tests de pénétration

```  

---

## 🎯 Choix du Référentiel d'Accessibilité
### WCAG 2.1 - Niveau AA
Référentiel choisi : Web Content Accessibility Guidelines (WCAG) 2.1 - Niveau AA

Justifications :

🌍 Standard international reconnu - Les WCAG 2.1 sont le référentiel officiel du W3C, utilisé mondialement et reconnu par les législations européenne et française.

⚖️ Conformité légale - Répond aux exigences de l'article 47 de la loi du 11 février 2005 en France et du European Accessibility Act, évitant les risques juridiques.

⚡ Niveau AA optimal - Équilibre parfait entre accessibilité maximale et faisabilité technique. Le niveau A est insuffisant, le niveau AAA souvent irréaliste pour une application interactive.

🛠️ Compatibilité technique - Parfaitement adapté aux technologies modernes (React, JavaScript ES6+) avec des outils de test matures (axe-core, Lighthouse).

⚽ Adapté au contexte - Couvre tous les besoins d'une application interactive de sport : navigation clavier pour le terrain, lecteurs d'écran pour les sélections, contrastes pour la lisibilité des formations.

📊 Mesurable et testable - Critères objectifs permettant des audits automatisés et manuels fiables, avec des métriques claires de conformité.

---

Le cahier de recettes est à retrouver dans le fichier correspondant à côté. de ce README.

*Développé par Jules DUPUIS - Projet sécurisé selon OWASP Top 10 2021*
