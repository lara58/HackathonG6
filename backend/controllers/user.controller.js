const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const Notification = require('../models/notification.model');
const mongoose = require('mongoose');

/**
 * Contrôleur pour la gestion des utilisateurs
 * Implémente toutes les fonctionnalités liées aux profils utilisateurs
 */
const userController = {
  /**
   * Récupère un utilisateur par son ID
   */
  getUserById: async (req, res) => {
    try {
      // Vérifier que l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID utilisateur non valide" });
      }

      const user = await User.findById(req.params.id)
        .select('-password')
        .lean();
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Compter les tweets, followers et following
      const tweetCount = await Tweet.countDocuments({ author: user._id });
      
      // Ajouter les compteurs à l'objet utilisateur
      user.tweetCount = tweetCount;
      user.followerCount = user.followers.length;
      user.followingCount = user.following.length;
      
      res.json(user);
    } catch (error) {
      console.error('Erreur getUserById:', error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: error.message });
    }
  },

  /**
   * Récupère un utilisateur par son nom d'utilisateur
   */
  getUserByUsername: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username })
        .select('-password')
        .lean();
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Compter les tweets, followers et following
      const tweetCount = await Tweet.countDocuments({ author: user._id });
      
      // Ajouter les compteurs à l'objet utilisateur
      user.tweetCount = tweetCount;
      user.followerCount = user.followers.length;
      user.followingCount = user.following.length;
      
      res.json(user);
    } catch (error) {
      console.error('Erreur getUserByUsername:', error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: error.message });
    }
  },

  /**
   * Met à jour le profil de l'utilisateur connecté
   */
  updateProfile: async (req, res) => {
    try {
      const { username, bio } = req.body;
      const updateData = {};
      
      // Ajouter les champs à mettre à jour seulement s'ils sont fournis
      if (username) updateData.username = username;
      if (bio) updateData.bio = bio;
      
      // Si une image de profil est fournie, ajouter son chemin
      if (req.file && req.file.gridFS) {
        updateData.profilePicture = req.file.path;
      }
      
      // Vérifier si le nom d'utilisateur est déjà utilisé
      if (username) {
        const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
        if (existingUser) {
          return res.status(400).json({ message: "Ce nom d'utilisateur est déjà utilisé" });
        }
      }
      
      // Mettre à jour le profil
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      res.status(400).json({ message: "Erreur lors de la mise à jour du profil", error: error.message });
    }
  },

  /**
   * Permet à l'utilisateur connecté de suivre un autre utilisateur
   */
  followUser: async (req, res) => {
    try {
      // Vérifier que l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID utilisateur non valide" });
      }
      
      // Vérifier que l'utilisateur ne tente pas de se suivre lui-même
      if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "Vous ne pouvez pas vous suivre vous-même" });
      }
      
      const userToFollow = await User.findById(req.params.id);
      if (!userToFollow) {
        return res.status(404).json({ message: "Utilisateur à suivre non trouvé" });
      }
      
      const currentUser = await User.findById(req.user.id);
      
      // Vérifier si l'utilisateur est déjà suivi
      if (currentUser.following.includes(userToFollow._id)) {
        return res.status(400).json({ message: "Vous suivez déjà cet utilisateur" });
      }
      
      // Mettre à jour la liste des utilisateurs suivis
      currentUser.following.push(userToFollow._id);
      await currentUser.save();
      
      // Mettre à jour la liste des followers de l'utilisateur suivi
      userToFollow.followers.push(currentUser._id);
      await userToFollow.save();
      
      // Créer une notification pour l'utilisateur qui est suivi
      await Notification.create({
        type: 'follow',
        sender: currentUser._id,
        recipient: userToFollow._id
      });
      
      res.json({ message: "Utilisateur suivi avec succès" });
    } catch (error) {
      console.error('Erreur followUser:', error);
      res.status(500).json({ message: "Erreur lors du suivi de l'utilisateur", error: error.message });
    }
  },

  /**
   * Permet à l'utilisateur connecté de ne plus suivre un autre utilisateur
   */
  unfollowUser: async (req, res) => {
    try {
      // Vérifier que l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID utilisateur non valide" });
      }
      
      const userToUnfollow = await User.findById(req.params.id);
      if (!userToUnfollow) {
        return res.status(404).json({ message: "Utilisateur à ne plus suivre non trouvé" });
      }
      
      const currentUser = await User.findById(req.user.id);
      
      // Vérifier si l'utilisateur est suivi
      if (!currentUser.following.includes(userToUnfollow._id)) {
        return res.status(400).json({ message: "Vous ne suivez pas cet utilisateur" });
      }
      
      // Mettre à jour la liste des utilisateurs suivis
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToUnfollow._id.toString()
      );
      await currentUser.save();
      
      // Mettre à jour la liste des followers de l'utilisateur
      userToUnfollow.followers = userToUnfollow.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
      await userToUnfollow.save();
      
      res.json({ message: "Vous ne suivez plus cet utilisateur" });
    } catch (error) {
      console.error('Erreur unfollowUser:', error);
      res.status(500).json({ message: "Erreur lors du désabonnement", error: error.message });
    }
  },

  /**
   * Récupère la liste des abonnés d'un utilisateur
   */
  getFollowers: async (req, res) => {
    try {
      // Vérifier que l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID utilisateur non valide" });
      }
      
      const user = await User.findById(req.params.id)
        .populate('followers', 'username profilePicture bio');
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json(user.followers);
    } catch (error) {
      console.error('Erreur getFollowers:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des abonnés", error: error.message });
    }
  },

  /**
   * Récupère la liste des abonnements d'un utilisateur
   */
  getFollowing: async (req, res) => {
    try {
      // Vérifier que l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID utilisateur non valide" });
      }
      
      const user = await User.findById(req.params.id)
        .populate('following', 'username profilePicture bio');
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json(user.following);
    } catch (error) {
      console.error('Erreur getFollowing:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des abonnements", error: error.message });
    }
  },

  /**
   * Récupère tous les tweets d'un utilisateur
   */
  getUserTweets: async (req, res) => {
    try {
      // Vérifier que l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID utilisateur non valide" });
      }
      
      const tweets = await Tweet.find({ author: req.params.id })
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 });
      
      res.json(tweets);
    } catch (error) {
      console.error('Erreur getUserTweets:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des tweets", error: error.message });
    }
  },

  /**
   * Recherche des utilisateurs par nom d'utilisateur
   */
  searchUsers: async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || query.length < 1) {
        return res.status(400).json({ message: "Terme de recherche requis" });
      }
      
      const users = await User.find({
        username: { $regex: query, $options: 'i' }
      })
      .select('username profilePicture bio')
      .limit(10);
      
      res.json(users);
    } catch (error) {
      console.error('Erreur searchUsers:', error);
      res.status(500).json({ message: "Erreur lors de la recherche d'utilisateurs", error: error.message });
    }
  }
};

module.exports = userController;
