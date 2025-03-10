# Tweeter - Hackathon 2025

## Description du projet
Cette application est un réseau social inspiré de Twitter, permettant aux utilisateurs de publier et interagir avec des tweets. Elle intègre également une intelligence artificielle de reconnaissance faciale des émotions (Facial Expressions Recognition - FER) qui analyse en temps réel les expressions faciales des utilisateurs.

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

### **7. Reconnaissance faciale des émotions (FER)**
- Analyse en temps réel des expressions faciales via la webcam.
- Détection des émotions : joie, tristesse, colère, surprise, dégoût, peur, neutre.

## Technologies utilisées
### **Développement de l’application (M1)**
- **Frontend** : React.js
- **Backend** : Node.js / Express
- **Base de données** : MongoDB Atlas
- **Déploiement** : Docker (ou en local sans Docker)

### **Intelligence Artificielle (M2)**
- **Deep Learning** : Modèle CNN pour la reconnaissance faciale.
- **Framework IA** : Flask (éventuellement Django).
- **Modèles pré-entrainés** : Hugging Face, EMO-AffectNet.
- **Datasets** :
  - [FER2013](https://www.kaggle.com/datasets/msambare/fer2013)
  - [AffectNet](https://www.kaggle.com/datasets/lintongdai/affectnet7) *(39 Go, échantillonnage recommandé)*

## Installation et exécution
### **1. Prérequis**
- **Node.js** installé
- **MongoDB Atlas** configuré
- **Python 3.x** installé (pour l’IA)
- **Docker** installé (optionnel)

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
cd ai
pip install -r requirements.txt
python app.py
```

### **3. Accès à l’application**
- **Frontend** : `http://localhost:3000`
- **Backend API** : `http://localhost:5000`
- **IA API** : `http://localhost:8000`

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