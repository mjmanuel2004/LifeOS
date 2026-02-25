import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirige vers la page de login, tout en gardant en mémoire la page d'origine
        // pour pouvoir y rediriger l'utilisateur après sa connexion.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
