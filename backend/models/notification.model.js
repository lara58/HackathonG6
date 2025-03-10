const mongoose = require('mongoose');

/**
 * Schéma de notification pour gérer les interactions entre utilisateurs
 * Types de notifications:
 * - like: quand un utilisateur aime un tweet
 * - retweet: quand un utilisateur retweete un tweet
 * - reply: quand un utilisateur répond à un tweet
 * - follow: quand un utilisateur commence à suivre un autre
 * - mention: quand un utilisateur est mentionné dans un tweet
 */

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['like', 'retweet', 'reply', 'follow', 'mention'],
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    // Requis pour tous les types sauf 'follow'
    required: function() {
      return this.type !== 'follow';
    }
  },
  replyTweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    // Requis uniquement pour le type 'reply'
    required: function() {
      return this.type === 'reply';
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: function() {
      switch(this.type) {
        case 'like': return 'a aimé votre tweet';
        case 'retweet': return 'a retweeté votre tweet';
        case 'reply': return 'a répondu à votre tweet';
        case 'follow': return 'a commencé à vous suivre';
        case 'mention': return 'vous a mentionné dans un tweet';
        default: return '';
      }
    }
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes fréquentes
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, recipient: 1, type: 1 });

// Méthode statique pour créer une notification et vérifier les doublons récents
notificationSchema.statics.createNotification = async function(notificationData) {
  // Vérifier s'il existe une notification similaire récente (dans les 5 dernières minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  const existingNotification = await this.findOne({
    sender: notificationData.sender,
    recipient: notificationData.recipient,
    type: notificationData.type,
    tweet: notificationData.tweet,
    createdAt: { $gt: fiveMinutesAgo }
  });
  
  // Si une notification similaire récente existe, ne pas en créer une nouvelle
  if (existingNotification) {
    return existingNotification;
  }
  
  // Créer une nouvelle notification
  return await this.create(notificationData);
};

// Méthode statique pour marquer toutes les notifications comme lues pour un utilisateur
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { recipient: userId, read: false },
    { read: true }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);
