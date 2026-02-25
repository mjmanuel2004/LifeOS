import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '../api';

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setIsLoading(true);

        try {
            await api.resetPassword(token, password);
            setSuccess('Votre mot de passe a été réinitialisé avec succès !');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'Le lien de réinitialisation est invalide ou a expiré.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] w-full bg-[#0B0C10] flex font-sans overflow-x-hidden md:p-4 lg:p-6 lg:items-center lg:justify-center">

            {/* --- MOBILE LAYOUT (Hidden on Desktop) --- */}
            <div className="w-full relative flex flex-col min-h-[100dvh] lg:hidden">
                {/* Background Gradient & Stars Mobile */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c36] via-[#0B0C10] to-[#0B0C10] pointer-events-none md:rounded-[40px] md:max-w-[420px] md:m-auto md:h-[90vh] md:max-h-[850px] md:shadow-2xl md:border md:border-white/5">
                    <div className="absolute top-[10%] left-[25%] w-[2px] h-[2px] bg-white/40 rounded-full" />
                    <div className="absolute top-[20%] left-[65%] w-[3px] h-[3px] bg-blue-400/30 rounded-full blur-[1px]" />
                </div>

                <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[100dvh] md:min-h-[90vh] md:max-h-[850px] relative z-10 p-6 pt-12 pb-10">

                    {/* Top Logo & Greeting */}
                    <div className="w-full flex flex-col items-center mb-8 mt-4">
                        <div className="w-16 h-16 bg-[#212E52]/40 backdrop-blur-md rounded-[20px] flex items-center justify-center border border-white/10 shadow-lg shadow-blue-900/10 mb-4">
                            <span className="text-2xl font-bold text-white">L</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8890A6] text-xs font-medium">
                            <Sparkles size={12} className="text-[#8890A6]" />
                            <span>Sécurité</span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="relative w-full mb-10">
                        <h1 className="text-[2.2rem] font-bold text-white tracking-tight leading-none mb-2">Nouveau mot de passe</h1>
                        <p className="text-[#8890A6] text-sm leading-relaxed">Veuillez entrer votre nouveau mot de passe ci-dessous.</p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
                            {success} <br /> Redirection en cours...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 relative z-20">
                        <div className="space-y-8">
                            <div className="relative border-b border-white/10 pb-2 focus-within:border-[#5282FF] transition-colors flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Nouveau mot de passe"
                                    required
                                />
                            </div>
                            <div className="relative border-b border-white/10 pb-2 focus-within:border-[#5282FF] transition-colors flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 text-[#646A80] hover:text-[#D1D5DB] transition-colors ml-2"
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 mt-10" />

                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-[1.75rem] font-bold text-white tracking-tight">Valider</h2>
                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7178F2] to-[#3B82F6] flex items-center justify-center active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100 glow-button"
                                style={{ boxShadow: '0 8px 25px -5px rgba(84, 114, 245, 0.4)' }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight size={24} className="text-white" strokeWidth={2.5} />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- DESKTOP LAYOUT (Hidden on Mobile) --- */}
            <div className="hidden lg:flex w-full max-w-[1400px] h-[85vh] min-h-[700px] bg-[#0A0D18] rounded-[40px] shadow-2xl overflow-hidden relative border border-white/5">

                {/* Desktop Background Star/Gradient Base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#12163b] via-[#0A0D18] to-[#05060A] pointer-events-none" />

                {/* Left Side: Form Content (approx 45% width) */}
                <div className="w-[45%] h-full flex flex-col justify-between px-16 py-12 relative z-10 shrink-0">

                    {/* Header Logo */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#212E52]/60 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg shadow-blue-900/10">
                            <span className="text-lg font-bold text-white">L</span>
                        </div>
                        <span className="text-white font-semibold tracking-wide text-lg">LifeOS</span>
                    </div>

                    {/* Main Form Area */}
                    <div className="w-full max-w-[420px] mx-auto flex flex-col pt-8">

                        {/* Greeting Chip */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c36]/50 border border-white/5 w-max mb-6 backdrop-blur-sm">
                            <Sparkles size={14} className="text-[#8890A6]" />
                            <span className="text-[#8890A6] text-xs font-medium">Sécurité</span>
                        </div>

                        {/* Title Split */}
                        <div className="mb-8">
                            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.15]">
                                <span className="text-white block">Nouveau</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5282FF] to-[#3B82F6] block mt-1">
                                    mot de passe
                                </span>
                            </h1>
                            <p className="text-[#8890A6] mt-4 font-medium text-sm leading-relaxed">
                                Veuillez entrer votre nouveau mot de passe ci-dessous. Assurez-vous qu'il soit fort et sécurisé.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                                {success} <br /> Vous allez être redirigé vers la page de connexion.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Glass Input Block - Password */}
                            <div className="relative flex items-center bg-[#1A1D2D]/60 backdrop-blur border border-white/5 rounded-2xl p-1 focus-within:border-blue-500/50 focus-within:bg-[#1f2336]/80 transition-all shadow-inner shadow-black/20">
                                <div className="pl-4 pr-3 text-[#646A80] pointer-events-none">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 bg-transparent py-3.5 text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Nouveau mot de passe"
                                    required
                                />
                            </div>

                            <div className="relative flex items-center bg-[#1A1D2D]/60 backdrop-blur border border-white/5 rounded-2xl p-1 focus-within:border-blue-500/50 focus-within:bg-[#1f2336]/80 transition-all shadow-inner shadow-black/20">
                                <div className="pl-4 pr-3 text-[#646A80] pointer-events-none">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="flex-1 bg-transparent py-3.5 text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="pr-4 pl-2 text-[#646A80] hover:text-[#D1D5DB] transition-colors focus:outline-none"
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Wide Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-[180px] mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#5282FF] to-[#3B82F6] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4)]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-white font-semibold text-[15px]">Valider</span>
                                        <ArrowRight size={18} className="text-white" strokeWidth={2} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Legal */}
                    <div className="text-[10px] text-[#4B5166] font-medium tracking-wide">
                        © 2026 LifeOS · Votre système de vie personnel
                    </div>
                </div>

                {/* Right Side: Visual Slanted Image Column */}
                <div className="absolute right-0 top-0 bottom-0 w-[60%] overflow-hidden pointer-events-none z-0" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                    {/* Dark gradient blur over image */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent via-[#0A0D18]/40 to-[#0A0D18] pointer-events-none" />

                    <img
                        src="/auth-bg.png"
                        alt="Aurora Aesthetics"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />

                    {/* Liquid Glass Overlay Effect */}
                    <div className="absolute inset-0 bg-[#0C152B]/40 mix-blend-overlay z-10" />

                    {/* Floating Liquid Glass Squares */}
                    <div className="absolute top-[20%] right-[25%] w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] transform -rotate-12 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-pulse" style={{ animationDuration: '7s' }} />
                    <div className="absolute bottom-[25%] left-[20%] w-20 h-20 bg-blue-500/10 backdrop-blur-md border border-white/10 rounded-2xl transform rotate-6 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-pulse" style={{ animationDuration: '9s' }} />
                </div>
            </div>
        </div>
    );
}
