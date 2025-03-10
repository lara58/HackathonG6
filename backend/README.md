### **README Backend**
#### *Fichier : `README_Backend.md`*
```markdown
# Tweeter - Backend

## Description
Ce backend gère les fonctionnalités principales de l’application Tweeter, incluant la gestion des utilisateurs, des tweets, des interactions et des notifications.

## Technologies utilisées
- **Node.js** avec **Express.js** pour l’API REST
- **MongoDB Atlas** pour la base de données
- **JWT** pour l’authentification
- **Socket.io** pour les notifications en temps réel
- **Multer** pour la gestion des images
- **Docker** (optionnel pour le déploiement)

## Installation et exécution

### **1. Prérequis**
- **Node.js** installé
- **MongoDB Atlas** configuré
- **Docker** installé (optionnel)

### **2. Installation**
```sh
cd backend
npm install
```

### **3. Configuration**
Créer un fichier `.env` dans `backend` et y ajouter :
```
PORT=5000
MONGO_URI=<VOTRE_URL_MONGODB>
JWT_SECRET=<VOTRE_SECRET_JWT>
```

### **4. Démarrage du serveur**
```sh
npm start
```
Le backend sera accessible à `http://localhost:5000`

### **5. Endpoints principaux**
| Méthode | Endpoint | Description |
|---------|---------|------------|
| `POST` | `/api/auth/register` | Inscription utilisateur |
| `POST` | `/api/auth/login` | Connexion utilisateur |
| `POST` | `/api/tweets` | Publier un tweet |
| `GET` | `/api/tweets` | Récupérer les tweets |
| `POST` | `/api/tweets/:id/like` | Liker un tweet |
| `POST` | `/api/tweets/:id/retweet` | Retweeter un tweet |
| `GET` | `/api/notifications` | Récupérer les notifications |

---