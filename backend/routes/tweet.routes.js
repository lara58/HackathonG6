const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweet.controller');
const auth = require('../middlewares/auth.middleware');
// Dans routes/tweet.routes.js
const { uploadSingle } = require('../middlewares/upload.middleware');

// Utiliser comme un array de middlewares
router.post('/', auth, ...uploadSingle('media'), tweetController.createTweet);
// Routes pour les tweets
router.get('/', tweetController.getAllTweets);
router.get('/feed', auth, tweetController.getFeed);
router.get('/trending', tweetController.getTrending);
router.get('/:id', tweetController.getTweetById);
router.post('/:id/like', auth, tweetController.likeTweet);
router.post('/:id/retweet', auth, tweetController.retweet);
// router.post('/:id/reply', auth, upload.single('media'), tweetController.replyToTweet);
router.delete('/:id', auth, tweetController.deleteTweet);

module.exports = router;
