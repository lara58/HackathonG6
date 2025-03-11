import axios from 'axios';
import { BASE_API_URL } from '../config';

/**
 * Configurer le client axios
 */
const axiosClient = axios.create({
    baseURL: BASE_API_URL, 
    timeout: 10000, 
});

/**
 * Ajout des intercepteurs
 * Integrer le token pour les requetes envoyés
 */
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Interceptions des réponses API
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erreur Axios:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
