import { useState } from 'react';
import { register, login, getCurrentUser } from '../services/authService';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await register(userData);
            setUser(data.user);
            localStorage.setItem('token', data.token); 
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await login(credentials);
            setUser(data.user);
            localStorage.setItem('token', data.token); 
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Pas de token trouvé');
            const userData = await getCurrentUser(token);
            setUser(userData); 
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, handleRegister, handleLogin, fetchCurrentUser };
};

export default useAuth;
