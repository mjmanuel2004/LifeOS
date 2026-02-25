import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialisation : vérifie si un token valide existe déjà
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.login(credentials);

            if (response.requires2FA) {
                return { success: true, requires2FA: true, tempToken: response.tempToken };
            }

            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const verify2FALogin = async (tempToken, code) => {
        try {
            const response = await api.verify2FALogin(tempToken, code);

            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (data) => {
        try {
            const { token, user } = await api.register(data);
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const googleLogin = async (idToken) => {
        try {
            const response = await api.googleLogin(idToken);

            if (response.requires2FA) {
                return { success: true, requires2FA: true, tempToken: response.tempToken };
            }

            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const githubLoginContext = async (code) => {
        try {
            const response = await api.githubLogin(code);

            if (response.requires2FA) {
                return { success: true, requires2FA: true, tempToken: response.tempToken };
            }

            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const appleLoginContext = async (identityToken, userStr) => {
        try {
            const response = await api.appleLogin(identityToken, userStr);

            if (response.requires2FA) {
                return { success: true, requires2FA: true, tempToken: response.tempToken };
            }

            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    if (loading) {
        return <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#09090b]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>; // Écran de chargement basique pendant la vérification du token
    }

    return (
        <AuthContext.Provider value={{ user, token, login, verify2FALogin, googleLoginContext: googleLogin, githubLoginContext, appleLoginContext, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};
