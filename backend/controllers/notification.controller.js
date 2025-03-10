const Notification = require('../models/notification.model');
const mongoose = require('mongoose');

/**
 * Contrôleur pour la gestion des notifications
 * Implémente les fonctionnalités liées au système de notification
 */
const notificationController = {
  /**
   * Récupère les notifications de l'utilisateur connecté
   */
  getUserNotifications: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 20;
      
      const notifications = await Notification.find({ recipient: req.user.id })
        .populate('sender', 'username profilePicture')
        .populate('tweet', 'content')
        .populate('replyTweet', 'content')
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit);

      const total = await Notification.countDocuments({ recipient: req.user.id });
      
      res.json({
        notifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: page * limit + notifications.length < total
      });
    } catch (error) {
      console.error('Erreur getUserNotifications:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message });
    }
  },
  
  /**
   * Marque une notification comme lue
   */
  markAsRead: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID de notification non valide" });
      }
      
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user.id },
        { read: true },
        { new: true }
      );
      
      if (!notification) {
        return res.status(404).json({ message: "Notification non trouvée ou non autorisée" });
      }
      
      res.json(notification);
    } catch (error) {
      console.error('Erreur markAsRead:', error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de la notification", error: error.message });
    }
  },
  
  /**
   * Marque toutes les notifications de l'utilisateur comme lues
   */
  markAllAsRead: async (req, res) => {
    try {
      const result = await Notification.updateMany(
        { recipient: req.user.id, read: false },
        { read: true }
      );
      
      res.json({ 
        message: "Toutes les notifications ont été marquées comme lues",
        modified: result.modifiedCount 
      });
    } catch (error) {
      console.error('Erreur markAllAsRead:', error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des notifications", error: error.message });
    }
  },
  
  /**
   * Supprime une notification
   */
  deleteNotification: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID de notification non valide" });
      }
      
      const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user.id
      });
      
      if (!notification) {
        return res.status(404).json({ message: "Notification non trouvée ou non autorisée" });
      }
      
      res.json({ message: "Notification supprimée avec succès" });
    } catch (error) {
      console.error('Erreur deleteNotification:', error);
      res.status(500).json({ message: "Erreur lors de la suppression de la notification", error: error.message });
    }
  },
  
  /**
   * Récupère le nombre de notifications non lues
   */
  getUnreadCount: async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        recipient: req.user.id,
        read: false
      });
      
      res.json({ count });
    } catch (error) {
      console.error('Erreur getUnreadCount:', error);
      res.status(500).json({ message: "Erreur lors du comptage des notifications non lues", error: error.message });
    }
  }
};

module.exports = notificationController;
