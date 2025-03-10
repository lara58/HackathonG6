const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const { uploadSingle } = require('../middlewares/upload.middleware');

// Utiliser comme un array de middlewares
// Routes pour les utilisateurs
router.get('/:id', userController.getUserById);
router.get('/:username', userController.getUserByUsername);
router.post('/', auth, ...uploadSingle('profilePicture'), userController.updateProfile);

router.post('/follow/:id', auth, userController.followUser);
router.post('/unfollow/:id', auth, userController.unfollowUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);
router.get('/:id/tweets', userController.getUserTweets);

module.exports = router;
