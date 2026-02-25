import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
    const [status, setStatus] = useState('Authentification en cours...');
    const navigate = useNavigate();
    const location = useLocation();
    const { githubLoginContext } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');

            if (!code) {
                setStatus('Erreur : Code d\'autorisation manquant.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                // If we add more providers later, we can read a "state" param here
                const result = await githubLoginContext(code);

                if (result.success && result.requires2FA) {
                    navigate('/verify-2fa', { state: { tempToken: result.tempToken } });
                } else if (result.success) {
                    navigate('/');
                } else {
                    setStatus(result.error || "Erreur lors de la connexion via GitHub");
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (err) {
                setStatus("Une erreur inattendue est survenue.");
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [location, githubLoginContext, navigate]);

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#09090b] text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-[#8890A6] font-medium text-center px-4">{status}</p>
        </div>
    );
}
