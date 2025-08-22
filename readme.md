# Tweeter - Hackathon IPSSI 2025 | Twitter IA

**Paris | Mars 2025 (1 mois)**

## Description du projet
Développement d'une plateforme sociale moderne avec **intelligence artificielle de reconnaissance des émotions** atteignant **85% de précision**. Cette application, inspirée de Twitter, permet aux utilisateurs de publier et interagir avec des tweets tout en intégrant une IA avancée de reconnaissance faciale des émotions (Facial Expressions Recognition - FER) qui analyse en temps réel les expressions faciales des utilisateurs.

## Fonctionnalités principales
### **1. Publication et gestion des tweets**
- Publier des tweets contenant du texte, images et vidéos.
- Ajouter des hashtags et mentions d’autres utilisateurs.
- Affichage de l’historique des tweets.

### **2. Interaction avec les tweets**
- **Like** : Exprimer son appréciation d’un tweet.
- **Retweet** : Partager un tweet sur son propre profil.
- **Réponse** : Ajouter un commentaire en réponse à un tweet.
- **Signet** : Enregistrer un tweet pour une consultation ultérieure.

### **3. Fil d’actualité personnalisé**
- Affichage des tweets en fonction des interactions et abonnements de l’utilisateur.
- Recommandation de tweets basés sur les préférences.
- Affichage des tendances et hashtags populaires.

### **4. Système de notifications**
- Notification en temps réel pour :
  - Like ou retweet d’un tweet.
  - Réponse à un tweet.
  - Nouvel abonné.
  - Mention dans un tweet.

### **5. Recherche avancée**
- Recherche de tweets par mots-clés, hashtags et utilisateurs.
- Filtres par date et popularité.

### **6. Gestion du profil utilisateur**
- Personnalisation du profil : nom d’utilisateur, biographie, photo de profil et bannière.
- Liste des abonnés et abonnements.
- Historique des tweets et interactions.

### **7. Intelligence Artificielle - Reconnaissance faciale des émotions (FER)**
- **Analyse en temps réel** des expressions faciales via la webcam avec **85% de précision**
- **Détection de 7 émotions** : joie, tristesse, colère, surprise, dégoût, peur, neutre
- **Modèle CNN optimisé** utilisant les datasets FER2013 et AffectNet
- **API haute performance** capable de traiter les requêtes d'analyse en temps réel

## Technologies utilisées
### **Développement de l’application (M1)**
- **Frontend** : React.js pour une interface utilisateur moderne et réactive
- **Backend** : Node.js / Express.js optimisé pour **500 requêtes API/min**
- **Base de données** : MongoDB Atlas pour un stockage cloud sécurisé et scalable
- **Conteneurisation** : Docker pour un déploiement complet et portable

### **Intelligence Artificielle (M2)**
- **Deep Learning** : Modèle CNN pour la reconnaissance faciale avec **85% de précision**
- **Framework IA** : Flask pour l'API de reconnaissance d'émotions
- **Modèles pré-entrainés** : Hugging Face, EMO-AffectNet
- **Datasets** :
  - [FER2013](https://www.kaggle.com/datasets/msambare/fer2013)
  - [AffectNet](https://www.kaggle.com/datasets/lintongdai/affectnet7) *(39 Go, échantillonnage recommandé)*

## Spécifications techniques
### **Performance**
- **API Backend** : Optimisée pour gérer **500 requêtes/minute**
- **IA de reconnaissance** : **85% de précision** sur la détection d'émotions
- **Temps de réponse** : Analyse en temps réel (< 100ms par frame)
- **Scalabilité** : Architecture microservices avec conteneurisation Docker

### **Architecture**
- **Microservices** : Séparation Backend/Frontend/IA pour une meilleure scalabilité
- **Containerisation complète** : Docker pour un déploiement unifié
- **Cloud-ready** : Compatible MongoDB Atlas et déploiement cloud

## Installation et exécution
### **1. Prérequis**
- **Node.js** installé
- **MongoDB Atlas** configuré
- **Python 3.x** installé (pour l’IA)
- **Docker & Docker Compose** installé (recommandé pour déploiement complet)

### **2. Installation de l’application**
#### **Backend**
```sh
cd backend
npm install
npm start
```

#### **Frontend**
```sh
cd frontend
npm install
npm start
```

#### **IA (Reconnaissance faciale)**
```sh
cd Project_deployement
pip install -r requirements.txt
python app.py
```

### **3. Accès à l’application**
- **Frontend** : `http://localhost:3000` (Interface utilisateur React.js)
- **Backend API** : `http://localhost:5000` (API REST - 500 req/min)
- **IA API** : `http://localhost:8000` (Reconnaissance émotions - 85% précision)

## Trello
Lien de gestion du projet : [Ajoutez ici votre lien Trello]

## Barème de notation
| Critères                          | Points |
|-----------------------------------|--------|
| Qualité de l’interface utilisateur | 6      |
| Fonctionnalités implémentées      | 8      |
| Performance et latence            | 2      |
| Originalité et créativité         | 2      |
| Qualité du code                   | 2      |
| Question bonus (Mona Lisa)        | 2      |

## Auteurs
- [Ajoutez les noms et rôles des membres de l’équipe]

## Ressources supplémentaires
- Documentation React : [https://react.dev/](https://react.dev/)
- Documentation Express.js : [https://expressjs.com/](https://expressjs.com/)
- Guide MongoDB Atlas : [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
- Documentation Flask : [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)

---
⚡ **Bon hackathon !** 🚀