import axiosClient from '../utils/axiosClient';

// Récupérer un utilisateur par ID
export const getUserById = async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
};

// Récupérer un utilisateur par nom d'utilisateur
export const getUserByUsername = async (username) => {
    const response = await axiosClient.get(`/users/${username}`);
    return response.data;
};

// Mettre à jour le profil de l'utilisateur connecté
export const updateProfile = async (profileData) => {
    const formData = new FormData();
    if (profileData.username) formData.append('username', profileData.username);
    if (profileData.bio) formData.append('bio', profileData.bio);
    if (profileData.profilePicture) formData.append('profilePicture', profileData.profilePicture);

    const response = await axiosClient.post('/users', formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Suivre un utilisateur
export const followUser = async (id) => {
    const response = await axiosClient.post(`/users/follow/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

// Ne plus suivre un utilisateur
export const unfollowUser = async (id) => {
    const response = await axiosClient.post(`/users/unfollow/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

// Récupérer les followers
export const getFollowers = async (id) => {
    const response = await axiosClient.get(`/users/${id}/followers`);
    return response.data;
};

// Récupérer les abonnements
export const getFollowing = async (id) => {
    const response = await axiosClient.get(`/users/${id}/following`);
    return response.data;
};

// Récupérer les tweets d'un utilisateur
export const getUserTweets = async (id) => {
    const response = await axiosClient.get(`/users/${id}/tweets`);
    return response.data;
};

// Rechercher des utilisateurs
export const searchUsers = async (query) => {
    const response = await axiosClient.get(`/users/search`, { params: { query } });
    return response.data;
};
