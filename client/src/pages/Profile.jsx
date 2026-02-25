import { useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Profile() {
    const { user } = useAuth();
    const [qrCode, setQrCode] = useState(null);
    const [secret, setSecret] = useState(null);
    const [token, setToken] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleGenerate2FA = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const res = await api.generate2FA();
            setQrCode(res.qrCode);
            setSecret(res.secret);
        } catch (err) {
            setError(err.message || 'Erreur lors de la génération 2FA');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEnable2FA = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setError('');
        setSuccess('');

        try {
            await api.enable2FA(token);
            setSuccess('Authentification à double facteur activée avec succès !');
            setQrCode(null);
        } catch (err) {
            setError(err.message || 'Code invalide. Veuillez réessayer.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    Mon Profil
                </h1>
                <p className="text-[#8890A6]">Gérez vos informations personnelles et paramètres de sécurité.</p>
            </header>

            {/* Profile Info Card */}
            <div className="bg-[#121526]/80 backdrop-blur-xl rounded-[24px] shadow-sm border border-white/5 overflow-hidden p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Informations Personnelles</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-[#8890A6]">Nom Complet</p>
                        <p className="text-white font-medium text-lg">{user?.name || 'Utilisateur'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#8890A6]">Adresse E-mail</p>
                        <p className="text-white font-medium text-lg">{user?.email || 'email@example.com'}</p>
                    </div>
                </div>
            </div>

            {/* Security Card (2FA) */}
            <div className="bg-[#121526]/80 backdrop-blur-xl rounded-[24px] shadow-sm border border-white/5 overflow-hidden p-6 relative">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <KeyRound className="text-blue-400" />
                    Sécurité & Authentification
                </h2>

                <div className="bg-[#1A1D2D] rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {user?.isTwoFactorEnabled ? (
                                <ShieldCheck className="text-green-400" size={24} />
                            ) : (
                                <ShieldAlert className="text-yellow-400" size={24} />
                            )}
                            <h3 className="text-lg font-medium text-white">
                                Authentification à 2 facteurs (2FA)
                            </h3>
                        </div>
                        <p className="text-[#8890A6] text-sm max-w-md">
                            Ajoutez une couche de sécurité supplémentaire à votre compte en demandant un code en plus de votre mot de passe à chaque connexion.
                        </p>
                    </div>

                    {!qrCode && !success && (
                        <button
                            onClick={handleGenerate2FA}
                            disabled={isGenerating}
                            className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {isGenerating ? 'Génération...' : 'Configurer'}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                        {success}
                    </div>
                )}

                {/* QR Code Setup Area */}
                {qrCode && !success && (
                    <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="shrink-0 bg-white p-2 rounded-xl">
                            <img src={qrCode} alt="2FA QR Code" className="w-40 h-40" />
                        </div>

                        <div className="flex-1 space-y-4">
                            <h4 className="text-white font-medium text-lg flex items-center gap-2">
                                <QrCode className="text-blue-400" />
                                Scannez le QR Code
                            </h4>
                            <p className="text-sm text-[#8890A6]">
                                1. Ouvrez votre application d'authentification (Google Authenticator, Authy, etc.).<br />
                                2. Scannez le QR Code ci-contre.<br />
                                3. Entrez le code à 6 chiffres généré par l'application ci-dessous pour vérifier.
                            </p>

                            <form onSubmit={handleEnable2FA} className="flex gap-3 pt-2 max-w-sm">
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 bg-[#1A1D2D] py-3 px-4 rounded-xl text-white placeholder-[#646A80] focus:outline-none border border-white/5 focus:border-blue-500 tracking-widest text-center"
                                    placeholder="000 000"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isVerifying || token.length !== 6}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    {isVerifying ? '...' : 'Valider'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
