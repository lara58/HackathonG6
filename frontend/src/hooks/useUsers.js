import { useState } from 'react';
import {
    getUserById,
    getUserByUsername,
    updateProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getUserTweets,
    searchUsers,
} from '../services/userService';

const useUsers = () => {
    const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [userTweets, setUserTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await getUserById(id);
            setUser(userData);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserByUsername = async (username) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await getUserByUsername(username);
            setUser(userData);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (profileData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await updateProfile(profileData);
            setUser(updatedUser);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const follow = async (id) => {
        try {
            await followUser(id);
            fetchFollowers(id);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    const unfollow = async (id) => {
        try {
            await unfollowUser(id);
            fetchFollowers(id);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        }
    };

    const fetchFollowers = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFollowers(id);
            setFollowers(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowing = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFollowing(id);
            setFollowing(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserTweets = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserTweets(id);
            setUserTweets(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const searchForUsers = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchUsers(query);
            return results;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
            return [];
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        followers,
        following,
        userTweets,
        loading,
        error,
        fetchUserById,
        fetchUserByUsername,
        updateUserProfile,
        follow,
        unfollow,
        fetchFollowers,
        fetchFollowing,
        fetchUserTweets,
        searchForUsers,
    };
};

export default useUsers;
