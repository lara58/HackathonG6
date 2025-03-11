import { useState } from 'react';
import {
    createTweet,
    getAllTweets,
    getFeed,
    getTrending,
    getTweetById,
    likeTweet,
    retweetTweet,
    deleteTweet,
} from '../services/tweetService';

const useTweets = () => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllTweets = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllTweets();
            setTweets(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const fetchFeed = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFeed();
            setTweets(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const createNewTweet = async (content, media) => {
        setLoading(true);
        setError(null);
        try {
            const newTweet = await createTweet(content, media);
            setTweets((prev) => [newTweet, ...prev]);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const toggleLikeTweet = async (id) => {
        try {
            const updatedTweet = await likeTweet(id);
            setTweets((prev) =>
                prev.map((tweet) =>
                    tweet._id === id ? updatedTweet : tweet
                )
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    const toggleRetweet = async (id) => {
        try {
            const updatedTweet = await retweetTweet(id);
            setTweets((prev) =>
                prev.map((tweet) =>
                    tweet._id === id ? updatedTweet : tweet
                )
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    const removeTweet = async (id) => {
        try {
            await deleteTweet(id);
            setTweets((prev) => prev.filter((tweet) => tweet._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    return {
        tweets,
        loading,
        error,
        fetchAllTweets,
        fetchFeed,
        createNewTweet,
        toggleLikeTweet,
        toggleRetweet,
        removeTweet,
    };
};

export default useTweets;
