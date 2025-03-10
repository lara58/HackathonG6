/**
 * Middleware de validation pour l'API
 * Vérifie les données des requêtes avant traitement
 */

// Validation de l'inscription
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  // Validation du nom d'utilisateur
  if (!username) {
    return res.status(400).json({ message: "Le nom d'utilisateur est requis" });
  }
  if (username.length < 3) {
    return res.status(400).json({ message: "Le nom d'utilisateur doit contenir au moins 3 caractères" });
  }
  if (username.length > 30) {
    return res.status(400).json({ message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ message: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores" });
  }

  // Validation de l'email
  if (!email) {
    return res.status(400).json({ message: "L'email est requis" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "L'email n'est pas valide" });
  }

  // Validation du mot de passe
  if (!password) {
    return res.status(400).json({ message: "Le mot de passe est requis" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
  }
  if (password.length > 100) {
    return res.status(400).json({ message: "Le mot de passe ne peut pas dépasser 100 caractères" });
  }
  // Pour renforcer la sécurité - décommentez si nécessaire
  // if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
  //   return res.status(400).json({ message: "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial" });
  // }

  next();
};

// Validation de la connexion
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Validation de l'email
  if (!email) {
    return res.status(400).json({ message: "L'email est requis" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "L'email n'est pas valide" });
  }

  // Validation du mot de passe
  if (!password) {
    return res.status(400).json({ message: "Le mot de passe est requis" });
  }

  next();
};

// Validation des tweets
const validateTweet = (req, res, next) => {
  const { content } = req.body;

  // Validation du contenu
  if (!content) {
    return res.status(400).json({ message: "Le contenu du tweet est requis" });
  }
  
  if (content.trim().length === 0) {
    return res.status(400).json({ message: "Le contenu du tweet ne peut pas être vide" });
  }

  if (content.length > 280) {
    return res.status(400).json({ message: "Le tweet ne peut pas dépasser 280 caractères" });
  }

  next();
};

// Validation de la mise à jour du profil
const validateProfileUpdate = (req, res, next) => {
  const { username, bio } = req.body;

  // Validation du nom d'utilisateur
  if (username) {
    if (username.length < 3) {
      return res.status(400).json({ message: "Le nom d'utilisateur doit contenir au moins 3 caractères" });
    }
    
    if (username.length > 30) {
      return res.status(400).json({ message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" });
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ message: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores" });
    }
  }

  // Validation de la bio
  if (bio && bio.length > 160) {
    return res.status(400).json({ message: "La bio ne peut pas dépasser 160 caractères" });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTweet,
  validateProfileUpdate
};
