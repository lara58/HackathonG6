const Tweet = require('../models/tweet.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

const tweetController = {
  createTweet: async (req, res) => {
    try {
      const { content } = req.body;
      const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
      
      const newTweet = new Tweet({
        content,
        author: req.user.id,
        hashtags: hashtags.map(tag => tag.substring(1)),
        media: req.file ? req.file.path : null
      });
      
      const savedTweet = await newTweet.save();
      const populatedTweet = await Tweet.findById(savedTweet._id)
        .populate('author', 'username profilePicture');
      
      res.status(201).json(populatedTweet);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  getAllTweets: async (req, res) => {
    try {
      const tweets = await Tweet.find({})
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 })
        .limit(20);
      res.json(tweets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getFeed: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const tweets = await Tweet.find({
        $or: [
          { author: { $in: user.following } },
          { author: req.user.id }
        ]
      })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);
      
      res.json(tweets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getTrending: async (req, res) => {
    try {
      // Aggregation pour obtenir les hashtags les plus utilisés
      const trendingHashtags = await Tweet.aggregate([
        { $unwind: '$hashtags' },
        { $group: { _id: '$hashtags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      res.json(trendingHashtags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getTweetById: async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id)
        .populate('author', 'username profilePicture')
        .populate('likes', 'username profilePicture')
        .populate('retweets', 'username profilePicture');
        
      if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
      
      res.json(tweet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  likeTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
      
      // Toggle like
      if (tweet.likes.includes(req.user.id)) {
        tweet.likes = tweet.likes.filter(id => id.toString() !== req.user.id);
      } else {
        tweet.likes.push(req.user.id);
        
        // Créer une notification si l'auteur n'est pas l'utilisateur qui aime
        if (tweet.author.toString() !== req.user.id) {
          await new Notification({
            type: 'like',
            sender: req.user.id,
            recipient: tweet.author,
            tweet: tweet._id
          }).save();
        }
      }
      
      await tweet.save();
      res.json(tweet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  retweet: async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
      
      // Toggle retweet
      if (tweet.retweets.includes(req.user.id)) {
        tweet.retweets = tweet.retweets.filter(id => id.toString() !== req.user.id);
      } else {
        tweet.retweets.push(req.user.id);
        
        // Créer une notification
        if (tweet.author.toString() !== req.user.id) {
          await new Notification({
            type: 'retweet',
            sender: req.user.id,
            recipient: tweet.author,
            tweet: tweet._id
          }).save();
        }
      }
      
      await tweet.save();
      res.json(tweet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  replyToTweet: async (req, res) => {
    try {
      const { content } = req.body;
      const parentTweet = await Tweet.findById(req.params.id);
      if (!parentTweet) return res.status(404).json({ message: 'Tweet not found' });
      
      const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
      
      const reply = new Tweet({
        content,
        author: req.user.id,
        hashtags: hashtags.map(tag => tag.substring(1)),
        media: req.file ? req.file.path : null,
        parentTweet: parentTweet._id
      });
      
      const savedReply = await reply.save();
      
      // Créer une notification
      if (parentTweet.author.toString() !== req.user.id) {
        await new Notification({
          type: 'reply',
          sender: req.user.id,
          recipient: parentTweet.author,
          tweet: parentTweet._id,
          replyTweet: savedReply._id
        }).save();
      }
      
      res.status(201).json(savedReply);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
      
      // Vérifier si l'utilisateur est l'auteur du tweet
      if (tweet.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this tweet' });
      }
      
      await tweet.remove();
      res.json({ message: 'Tweet deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = tweetController;
