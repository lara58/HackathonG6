### **README Frontend**
#### *Fichier : `README_Frontend.md`*
```markdown
# Tweeter - Frontend

## Description
Ce frontend est l'interface utilisateur de l’application Tweeter. Il permet aux utilisateurs de publier et d’interagir avec les tweets, de gérer leur profil et de visualiser les notifications.

## Technologies utilisées
- **React.js** pour l’interface utilisateur
- **Redux** pour la gestion d’état (optionnel)
- **Axios** pour les requêtes API
- **Socket.io-client** pour les notifications en temps réel
- **Tailwind CSS** (ou autre) pour le design

## Installation et exécution

### **1. Prérequis**
- **Node.js** installé

### **2. Installation**
```sh
cd frontend
npm install
```

### **3. Configuration**
Créer un fichier `.env` dans `frontend` et y ajouter :
```
REACT_APP_API_URL=http://localhost:5000
```

### **4. Démarrage du projet**
```sh
npm start
```
Le frontend sera accessible à `http://localhost:3000`

### **5. Fonctionnalités implémentées**
- Inscription et connexion utilisateur
- Publication, like et retweet des tweets
- Affichage du fil d’actualité
- Gestion du profil utilisateur
- Système de notifications en temps réel
```
