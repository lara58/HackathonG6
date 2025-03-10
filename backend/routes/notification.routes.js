const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * Routes pour la gestion des notifications
 * Permet aux utilisateurs de visualiser et interagir avec leurs notifications
 */

// Récupérer toutes les notifications de l'utilisateur connecté
router.get('/', auth, notificationController.getUserNotifications);

// Marquer une notification comme lue
router.put('/:id/read', auth, notificationController.markAsRead);

// Marquer toutes les notifications comme lues
router.put('/read-all', auth, notificationController.markAllAsRead);

// Supprimer une notification
router.delete('/:id', auth, notificationController.deleteNotification);

// Récupérer le nombre de notifications non lues
router.get('/unread-count', auth, notificationController.getUnreadCount);

module.exports = router;
