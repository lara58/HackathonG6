const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const config = require('./config/config');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const tweetRoutes = require('./routes/tweet.routes');
const userRoutes = require('./routes/user.routes');
const notificationRoutes = require('./routes/notification.routes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection using config
config.connectDB();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);


// Route racine pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tweeter API 🐷' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '😭 Server error', error: err.message });
});

const PORT = config.PORT;
const URL_BACKEND = config.URL_BACKEND;
app.listen(PORT, () => {
  console.log(`🚀 Server is running ${URL_BACKEND}${PORT}`);
});
