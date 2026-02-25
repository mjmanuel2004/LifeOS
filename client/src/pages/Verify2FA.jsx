import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Verify2FA() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { verify2FALogin } = useAuth();

    const tempToken = location.state?.tempToken;

    useEffect(() => {
        // If they navigate here directly without a tempToken from Login, kick them to login
        if (!tempToken) {
            navigate('/login');
        }
    }, [tempToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await verify2FALogin(tempToken, code);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Code incorrect ou session expirée');
            setIsLoading(false);
        }
    };

    if (!tempToken) return null;

    return (
        <div className="min-h-[100dvh] w-full bg-[#0B0C10] flex font-sans overflow-x-hidden md:p-4 lg:p-6 lg:items-center lg:justify-center">

            {/* --- MOBILE LAYOUT (Hidden on Desktop) --- */}
            <div className="w-full relative flex flex-col min-h-[100dvh] lg:hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c36] via-[#0B0C10] to-[#0B0C10] pointer-events-none md:rounded-[40px] md:max-w-[420px] md:m-auto md:h-[90vh] md:max-h-[850px] md:shadow-2xl md:border md:border-white/5">
                    <div className="absolute top-[10%] left-[25%] w-[2px] h-[2px] bg-white/40 rounded-full" />
                    <div className="absolute top-[20%] left-[65%] w-[3px] h-[3px] bg-blue-400/30 rounded-full blur-[1px]" />
                </div>

                <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[100dvh] md:min-h-[90vh] md:max-h-[850px] relative z-10 p-6 pt-12 pb-10">

                    <button onClick={() => navigate('/login')} className="mb-4 text-[#8890A6] hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft size={18} /> Retour
                    </button>

                    <div className="w-full flex flex-col items-center mb-8 mt-4">
                        <div className="w-16 h-16 bg-[#212E52]/40 backdrop-blur-md rounded-[20px] flex items-center justify-center border border-white/10 shadow-lg shadow-blue-900/10 mb-4">
                            <span className="text-2xl font-bold text-white">L</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8890A6] text-xs font-medium">
                            <Sparkles size={12} className="text-[#8890A6]" />
                            <span>Sécurité Renforcée</span>
                        </div>
                    </div>

                    <div className="relative w-full mb-10">
                        <h1 className="text-[2.2rem] font-bold text-white tracking-tight leading-none mb-2">Double Facteur</h1>
                        <p className="text-[#8890A6] text-sm leading-relaxed">
                            Ouvrez votre application d'authentification et entrez le code à 6 chiffres pour continuer.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 relative z-20">
                        <div className="space-y-8">
                            <div className="relative border-b border-white/10 pb-2 focus-within:border-[#5282FF] transition-colors">
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-transparent text-white placeholder-[#646A80] focus:outline-none text-[32px] tracking-[1em] text-center font-medium"
                                    placeholder="000000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex-1 mt-10" />

                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-[1.75rem] font-bold text-white tracking-tight">Vérifier</h2>
                            <button
                                type="submit"
                                disabled={isLoading || code.length !== 6}
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

                <div className="absolute inset-0 bg-gradient-to-br from-[#12163b] via-[#0A0D18] to-[#05060A] pointer-events-none" />

                {/* Left Side: Form Content */}
                <div className="w-[45%] h-full flex flex-col justify-between px-16 py-12 relative z-10 shrink-0">

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#212E52]/60 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg shadow-blue-900/10">
                            <span className="text-lg font-bold text-white">L</span>
                        </div>
                        <span className="text-white font-semibold tracking-wide text-lg">LifeOS</span>
                    </div>

                    <div className="w-full max-w-[420px] mx-auto flex flex-col pt-8">
                        <button onClick={() => navigate('/login')} className="mb-6 text-[#8890A6] hover:text-white transition-colors flex items-center gap-2 w-max text-sm">
                            <ArrowLeft size={16} /> Retour
                        </button>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c36]/50 border border-white/5 w-max mb-6 backdrop-blur-sm">
                            <ShieldCheck size={14} className="text-[#8890A6]" />
                            <span className="text-[#8890A6] text-xs font-medium">Authentification à deux facteurs</span>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.15]">
                                <span className="text-white block">Sécurité</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5282FF] to-[#3B82F6] block mt-1">
                                    Renforcée
                                </span>
                            </h1>
                            <p className="text-[#8890A6] mt-4 font-medium text-sm leading-relaxed">
                                Ouvrez votre application d'authentification et entrez le code à 6 chiffres pour vous connecter à votre espace LifeOS.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="relative flex items-center bg-[#1A1D2D]/60 backdrop-blur border border-white/5 rounded-2xl p-1 focus-within:border-blue-500/50 focus-within:bg-[#1f2336]/80 transition-all shadow-inner shadow-black/20">
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 bg-transparent py-4 text-white placeholder-[#646A80] focus:outline-none text-[28px] tracking-[1em] text-center font-medium"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || code.length !== 6}
                                className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-[#5282FF] to-[#3B82F6] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4)]"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-white font-semibold text-[16px]">Vérifier et continuer</span>
                                        <ArrowRight size={20} className="text-white" strokeWidth={2} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="text-[10px] text-[#4B5166] font-medium tracking-wide">
                        © 2026 LifeOS · Votre système de vie personnel
                    </div>
                </div>

                {/* Right Side: Visual Slanted Image Column */}
                <div className="absolute right-0 top-0 bottom-0 w-[60%] overflow-hidden pointer-events-none z-0" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                    <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent via-[#0A0D18]/40 to-[#0A0D18] pointer-events-none" />

                    <img
                        src="/auth-bg.png"
                        alt="Aurora Aesthetics"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />

                    <div className="absolute inset-0 bg-[#0C152B]/40 mix-blend-overlay z-10" />

                    <div className="absolute top-[20%] right-[25%] w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] transform -rotate-12 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-pulse" style={{ animationDuration: '7s' }} />
                    <div className="absolute bottom-[25%] left-[20%] w-20 h-20 bg-blue-500/10 backdrop-blur-md border border-white/10 rounded-2xl transform rotate-6 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-pulse" style={{ animationDuration: '9s' }} />
                </div>
            </div>
        </div>
    );
}
