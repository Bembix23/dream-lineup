# Cahier de Recettes - Dream Lineup

## Objectif
Valider l'ensemble des fonctionnalités de l'application Dream Lineup et s'assurer de la conformité aux exigences fonctionnelles, structurelles et de sécurité.

## Plan de Tests

### 1. Tests Fonctionnels
- Gestion des utilisateurs (inscription, connexion, compte)
- Création et gestion d'équipes
- Interface de terrain interactif
- Sauvegarde et chargement d'équipes

### 2. Tests Structurels
- Architecture frontend/backend
- Intégration API externe
- Base de données Firebase

### 3. Tests de Sécurité
- Authentification et autorisation
- Protection OWASP
- Validation des données

## Scénarios de Tests Fonctionnels

### RF01 - Gestion des Utilisateurs

#### TC01 - Inscription utilisateur
Préconditions : Application démarrée
Étapes :
1. Cliquer sur "Se Connecter"
2. Cliquer sur "Créer un compte"
2. Saisir email valide : test@example.com
3. Saisir mot de passe : motdepasse123
4. Cliquer sur "Créer"

Résultat attendu : Création compte + redirection vers tableau de bord
Statut : VALIDÉ

#### TC02 - Connexion utilisateur
Préconditions : Compte utilisateur existant
Étapes :
1. Cliquer sur "Se connecter"
2. Cliquer sur "Se connecter"
2. Saisir identifiants valides
3. Cliquer sur "Se connecter"

Résultat attendu : Connexion réussie + accès aux fonctionnalités
Statut : VALIDÉ

#### TC03 - Gestion du compte
Préconditions : Utilisateur connecté
Étapes :
1. Accéder à "Voir le profil"
2. Modifier l'email
3. Modifier le mot de passe

Résultat attendu : Modifications enregistrées + confirmation
Statut : VALIDÉ

### RF02 - Création d'Équipe

#### TC04 - Sélection de formation
Préconditions : Application démarrée
Étapes :
1. Cliquer sur "Créer une équipe"
2. Sélectionner formation "4-4-2"

Résultat attendu : Terrain affiché avec positions 4-4-2
Statut : VALIDÉ

#### TC05 - Ajout de joueurs
Préconditions : Formation sélectionnée
Étapes :
1. Cliquer sur une position libre
2. Sélectionner "Ligue 1"
3. Choisir "Paris Saint-Germain"
4. Sélectionner un joueur disponible

Résultat attendu : Joueur ajouté à la position avec son nom
Statut : VALIDÉ

#### TC06 - Sauvegarde d'équipe
Préconditions : Toute l'équipe ajoutée + Utilisateur connecté
Étapes :
1. Cliquer sur bouton avec l'icone de sauvegarde
2. Saisir nom : "Mon Équipe Test"
3. Confirmer la sauvegarde

Résultat attendu : Équipe sauvegardée + message de confirmation
Statut : VALIDÉ

### RF03 - Gestion des Équipes

#### TC07 - Liste des équipes
Préconditions : Équipes sauvegardées existantes
Étapes :
1. Accéder à "Mes équipes"
2. Vérifier l'affichage de la liste

Résultat attendu : Liste complète avec noms et formations
Statut : VALIDÉ

#### TC08 - Chargement d'équipe
Préconditions : Dans la liste des équipes
Étapes :
1. Cliquer sur le nom d'une équipe
2. Vérifier l'affichage sur le terrain

Résultat attendu : Équipe chargée avec tous les joueurs en position
Statut : VALIDÉ

#### TC09 - Changement nom d'équipe
Préconditions : Dans la liste des équipes
Étapes :
1. Cliquer sur "Renommer"
2. Entrer le nouveau nom
3. Cliquer sur le bouton "Valider"

Résultat attendu : Équipe renommée + mise à jour dans la liste
Statut : VALIDÉ

#### TC10 - Suppression d'équipe
Préconditions : Dans la liste des équipes
Étapes :
1. Cliquer sur "Supprimer"

Résultat attendu : Équipe supprimée + mise à jour de la liste
Statut : VALIDÉ

## Tests Structurels

### TS01 - Architecture Frontend
Test : Vérification de la structure React
Commande : npm test
Résultat attendu : 52 tests passent
Statut : VALIDÉ (52/52 tests OK)

### TS02 - Architecture Backend
Test : Vérification de la structure NestJS
Commande : npm test
Résultat attendu : 17 tests passent
Statut : VALIDÉ (17/17 tests OK)

### TS03 - Intégration API Football-Data
Test : Appels API externes avec cache
Endpoints testés : /leagues, /teams, /players
Résultat attendu : Données récupérées et mises en cache
Statut : VALIDÉ

### TS04 - Base de données Firebase
Test : CRUD des équipes utilisateur
Opérations : Create, Read, Update, Delete
Résultat attendu : Persistance des données
Statut : VALIDÉ

## Tests de Sécurité

### SEC01 - Authentification Firebase
Test : Protection des routes privées
Scénario : Accès sans token valide
Résultat attendu : Erreur 401 Unauthorized
Statut : VALIDÉ

### SEC02 - Protection OWASP
Tests automatisés : npm run security:audit
Couverture :
- A02 - Défaillances cryptographiques : VALIDÉ
- A05 - Mauvaise configuration sécurité : VALIDÉ
- A09 - Journalisation insuffisante : VALIDÉ
- A10 - Falsification de requête : VALIDÉ

Statut : VALIDÉ

### SEC03 - Validation des données
Test : Injection de données malveillantes
Endpoints testés : /save-team, /get-teams
Résultat attendu : Validation échoue + erreur 400
Statut : VALIDÉ

### SEC04 - Rate Limiting
Test : Limitation des requêtes
Scénario : 100 requêtes en 1 minute
Résultat attendu : Erreur 429 après limite
Statut : VALIDÉ

## Tests d'Accessibilité

### ACC01 - Conformité WCAG 2.1 AA
Test : Audit automatisé Lighthouse
Score obtenu : 100/100
Résultat attendu : Score >= 95/100
Statut : VALIDÉ

## Résultats Globaux

### Couverture de Tests
- Tests Frontend : 52/52 VALIDÉ
- Tests Backend : 17/17 VALIDÉ
- Tests E2E : 5/5 VALIDÉ
- Tests Sécurité : 15/15 VALIDÉ
- Tests Accessibilité : 8/8 VALIDÉ

### Métriques de Qualité
- Couverture de code : 85%+ VALIDÉ
- Performance Lighthouse : 98/100 VALIDÉ
- Accessibilité Lighthouse : 100/100 VALIDÉ
- Sécurité : Aucune vulnérabilité critique VALIDÉ

## Conclusion

### Fonctionnalités Validées (100%)
- Gestion utilisateurs complète
- Création d'équipes interactive
- Sauvegarde/chargement d'équipes
- Interface responsive et accessible

### Exigences Non-Fonctionnelles
- Sécurité OWASP conforme
- Performance web optimisée
- Accessibilité WCAG 2.1 AA
- Architecture scalable

### Prêt pour la Production
L'application Dream Lineup est conforme à l'ensemble des exigences du cahier des charges et prête pour le déploiement en production.

Date de validation : 21 août 2025
Validé par : Équipe de développement
Version testée : 1.0.0