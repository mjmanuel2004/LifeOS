import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Eye, EyeOff, Sparkles, Mail, Lock, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const AppleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.496 3.603-2.998 1.14-1.676 1.604-3.299 1.634-3.385-.034-.017-3.181-1.22-3.216-4.858-.026-3.04 2.482-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.513 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z" />
    </svg>
);

const GithubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
);

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, googleLoginContext, appleLoginContext } = useAuth();
    const navigate = useNavigate();

    const doGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');

            const result = await googleLoginContext(tokenResponse.access_token);

            if (result.success && result.requires2FA) {
                navigate('/verify-2fa', { state: { tempToken: result.tempToken } });
            } else if (result.success) {
                navigate('/');
            } else {
                setError(result.error || "Erreur lors de l'inscription via Google");
                setIsLoading(false);
            }
        },
        onError: () => setError('Google Login Failed')
    });

    const doGithubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/callback`;
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
        window.location.href = githubUrl;
    };

    const doAppleLogin = async (response) => {
        if (response.error) {
            setError("Erreur lors de l'inscription via Apple");
            return;
        }

        setIsLoading(true);
        setError('');

        const userStr = response.user ? JSON.stringify(response.user) : undefined;
        const result = await appleLoginContext(response.authorization.id_token, userStr);

        if (result.success && result.requires2FA) {
            navigate('/verify-2fa', { state: { tempToken: result.tempToken } });
        } else if (result.success) {
            navigate('/');
        } else {
            setError(result.error || "Erreur lors de l'inscription via Apple");
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await register({ name, email, password });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || "Erreur lors de l'inscription");
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
                    <div className="absolute top-[15%] right-[20%] w-[1.5px] h-[1.5px] bg-white/60 rounded-full" />
                    <div className="absolute top-[30%] right-[30%] w-[2px] h-[2px] bg-indigo-300/40 rounded-full blur-[1px]" />
                </div>

                <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[100dvh] md:min-h-[90vh] md:max-h-[850px] relative z-10 p-6 pt-12 pb-10">
                    {/* Top Logo & Greeting */}
                    <div className="w-full flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-[#212E52]/40 backdrop-blur-md rounded-[20px] flex items-center justify-center border border-white/10 shadow-lg shadow-blue-900/10 mb-4">
                            <span className="text-2xl font-bold text-white">L</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8890A6] text-xs font-medium">
                            <Sparkles size={12} className="text-[#8890A6]" />
                            <span>Rejoignez LifeOS</span>
                        </div>
                    </div>

                    {/* Title and White Curve */}
                    <div className="relative w-full mb-8">
                        <h1 className="text-[2.5rem] font-bold text-white tracking-tight leading-none">Inscription</h1>

                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Social Logins */}
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <span className="text-[#646A80] text-sm font-medium mr-1">Avec</span>
                        <button type="button" onClick={() => doGoogleLogin()} className="w-12 h-12 rounded-full bg-[#161822] flex items-center justify-center hover:bg-[#1C1F2E] transition-colors">
                            <GoogleIcon />
                        </button>
                        <AppleSignin
                            authOptions={{
                                clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'com.lifeos.web',
                                scope: 'email name',
                                redirectURI: `${window.location.origin}/auth/callback`,
                                state: 'state',
                                nonce: 'nonce',
                                usePopup: true
                            }}
                            uiType="dark"
                            className="w-12 h-12 rounded-full bg-[#161822] flex items-center justify-center text-[#D1D5DB] hover:bg-[#1C1F2E] transition-colors focus:outline-none"
                            onSuccess={(response) => doAppleLogin(response)}
                            onError={(error) => console.error(error)}
                            render={(props) => (
                                <button {...props} type="button" className="w-12 h-12 rounded-full bg-[#161822] flex items-center justify-center text-[#D1D5DB] hover:bg-[#1C1F2E] transition-colors focus:outline-none">
                                    <AppleIcon />
                                </button>
                            )}
                        />
                        <button type="button" onClick={doGithubLogin} className="w-12 h-12 rounded-full bg-[#161822] flex items-center justify-center text-[#D1D5DB] hover:bg-[#1C1F2E] transition-colors focus:outline-none">
                            <GithubIcon />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] flex-1 bg-white/5" />
                        <span className="text-[10px] font-bold text-[#4B5166] tracking-[0.2em] uppercase">OU</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 relative z-20">
                        <div className="space-y-6">
                            {/* Name Input */}
                            <div className="relative border-b border-white/10 pb-2 focus-within:border-[#5282FF] transition-colors">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Nom complet"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="relative border-b border-white/10 pb-2 focus-within:border-[#5282FF] transition-colors">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="E-mail"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative border-b border-white/10 pb-2 focus-within:border-[#5282FF] transition-colors flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Mot de passe"
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

                        {/* Spacer to push submit block to the bottom */}
                        <div className="flex-1 mt-10" />

                        {/* Submit Row */}
                        <div className="flex items-center justify-between mt-auto mb-10">
                            <h2 className="text-[1.75rem] font-bold text-white tracking-tight">Créer mon compte</h2>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7178F2] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100"
                                style={{ boxShadow: '0 8px 25px -5px rgba(84, 114, 245, 0.4)' }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight size={24} className="text-white" strokeWidth={2.5} />
                                )}
                            </button>
                        </div>

                        {/* Bottom Links Group */}
                        <div className="flex flex-col items-center gap-6 mt-2">
                            <div className="text-[13px] font-medium text-[#646A80]">
                                Déjà un compte ?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-[#A5C0FF] hover:text-[#C5D8FF] transition-colors font-semibold ml-1"
                                >
                                    Se connecter
                                </button>
                            </div>

                            <div className="text-[11px] text-[#4B5166] text-center max-w-[280px] leading-relaxed">
                                En vous inscrivant, vous acceptez les <a href="#" className="underline decoration-[#4B5166] hover:text-[#646A80] underline-offset-2 transition-colors">conditions</a> et la <a href="#" className="underline decoration-[#4B5166] hover:text-[#646A80] underline-offset-2 transition-colors">politique de confidentialité</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- DESKTOP LAYOUT (Hidden on Mobile) --- */}
            <div className="hidden lg:flex w-full max-w-[1400px] min-h-[820px] lg:my-8 bg-[#0A0D18] rounded-[40px] shadow-2xl overflow-hidden relative border border-white/5">

                {/* Desktop Background Star/Gradient Base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#12163b] via-[#0A0D18] to-[#05060A] pointer-events-none">
                    <div className="absolute top-[15%] left-[10%] w-[2px] h-[2px] bg-white/40 rounded-full" />
                    <div className="absolute top-[35%] left-[40%] w-[3px] h-[3px] bg-blue-400/30 rounded-full blur-[1px]" />
                    <div className="absolute bottom-[20%] left-[25%] w-[1.5px] h-[1.5px] bg-white/60 rounded-full" />
                </div>

                {/* Left Side: Form Content (approx 45% width) */}
                <div className="w-[45%] flex flex-col justify-between px-16 py-12 relative z-10 shrink-0">

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
                            <span className="text-[#8890A6] text-xs font-medium">Rejoignez LifeOS</span>
                        </div>

                        {/* Title Split */}
                        <div className="mb-8">
                            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.15]">
                                <span className="text-white block">Créez</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] block mt-1">
                                    votre compte
                                </span>
                            </h1>
                            <p className="text-[#8890A6] mt-3 font-medium text-sm">
                                Commencez votre voyage vers une meilleure organisation
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Glass Input Block - Name */}
                            <div className="relative flex items-center bg-[#1A1D2D]/60 backdrop-blur border border-white/5 rounded-2xl p-1 focus-within:border-orange-500/50 focus-within:bg-[#1f2336]/80 transition-all shadow-inner shadow-black/20">
                                <div className="pl-4 pr-3 text-[#646A80] pointer-events-none">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 bg-transparent py-3.5 text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Nom complet"
                                    required
                                />
                            </div>

                            {/* Glass Input Block - Email */}
                            <div className="relative flex items-center bg-[#1A1D2D]/60 backdrop-blur border border-white/5 rounded-2xl p-1 focus-within:border-orange-500/50 focus-within:bg-[#1f2336]/80 transition-all shadow-inner shadow-black/20">
                                <div className="pl-4 pr-3 text-[#646A80] pointer-events-none">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-transparent py-3.5 text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Adresse e-mail"
                                    required
                                />
                            </div>

                            {/* Glass Input Block - Password */}
                            <div className="relative flex items-center bg-[#1A1D2D]/60 backdrop-blur border border-white/5 rounded-2xl p-1 focus-within:border-orange-500/50 focus-within:bg-[#1f2336]/80 transition-all shadow-inner shadow-black/20">
                                <div className="pl-4 pr-3 text-[#646A80] pointer-events-none">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 bg-transparent py-3.5 text-white placeholder-[#646A80] focus:outline-none text-[15px] font-medium"
                                    placeholder="Mot de passe"
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
                                disabled={isLoading}
                                className="w-[180px] mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100 shadow-[0_4px_20px_-4px_rgba(255,107,107,0.4)]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-white font-semibold text-[15px]">S'inscrire</span>
                                        <ArrowRight size={18} className="text-white" strokeWidth={2} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider & Socials */}
                        <div className="mt-8 flex flex-col gap-5 w-full">
                            <div className="flex items-center gap-4 w-full justify-center">
                                <div className="h-[1px] w-20 bg-white/5" />
                                <span className="text-[10px] font-bold text-[#4B5166] tracking-[0.15em] uppercase">OU CONTINUER AVEC</span>
                                <div className="h-[1px] w-20 bg-white/5" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <AppleSignin
                                    authOptions={{
                                        clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'com.lifeos.web',
                                        scope: 'email name',
                                        redirectURI: `${window.location.origin}/auth/callback`,
                                        state: 'state',
                                        nonce: 'nonce',
                                        usePopup: true
                                    }}
                                    uiType="dark"
                                    className="w-full h-[52px] rounded-2xl bg-[#141724]/60 border border-white/5 flex items-center justify-center text-[#D1D5DB] hover:bg-[#1A1D2D] transition-colors shadow-inner shadow-black/20 backdrop-blur-sm focus:outline-none"
                                    onSuccess={(response) => doAppleLogin(response)}
                                    onError={(error) => console.error(error)}
                                    render={(props) => (
                                        <button {...props} type="button" className="w-full h-[52px] rounded-2xl bg-[#141724]/60 border border-white/5 flex items-center justify-center text-[#D1D5DB] hover:bg-[#1A1D2D] transition-colors shadow-inner shadow-black/20 backdrop-blur-sm focus:outline-none">
                                            <AppleIcon />
                                        </button>
                                    )}
                                />
                                <button type="button" onClick={() => doGoogleLogin()} className="w-full h-[52px] rounded-2xl bg-[#141724]/60 border border-white/5 flex items-center justify-center hover:bg-[#1A1D2D] transition-colors shadow-inner shadow-black/20 backdrop-blur-sm">
                                    <GoogleIcon />
                                </button>
                                <button type="button" onClick={doGithubLogin} className="w-full h-[52px] rounded-2xl bg-[#141724]/60 border border-white/5 flex items-center justify-center text-[#D1D5DB] hover:bg-[#1A1D2D] transition-colors shadow-inner shadow-black/20 backdrop-blur-sm focus:outline-none">
                                    <GithubIcon />
                                </button>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="mt-8 text-center flex flex-col items-center gap-4">
                            <div>
                                <span className="text-[#646A80] text-[13px] font-medium">Déjà un compte ? </span>
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-[#FF8E53] hover:text-[#FFAE80] text-[13px] font-semibold transition-colors ml-1"
                                >
                                    Se connecter
                                </button>
                            </div>
                            <div className="text-[11px] text-[#4B5166] text-center max-w-[280px] leading-relaxed">
                                En vous inscrivant, vous acceptez les <a href="#" className="underline decoration-[#4B5166] hover:text-[#646A80] underline-offset-2 transition-colors">conditions</a> et la <a href="#" className="underline decoration-[#4B5166] hover:text-[#646A80] underline-offset-2 transition-colors">politique de confidentialité</a>
                            </div>
                        </div>
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

                    {/* The Background Photo (We'll reuse the auth-bg.png but could be different) */}
                    <img
                        src="/auth-bg.png"
                        alt="Aurora Aesthetics"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />

                    {/* Liquid Glass Overlay Effect */}
                    <div className="absolute inset-0 bg-[#0C152B]/40 mix-blend-overlay z-10" />

                    {/* Floating Liquid Glass Squares (Pinkish Hue for Register) */}
                    <div className="absolute top-[20%] right-[25%] w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] transform -rotate-12 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-pulse" style={{ animationDuration: '7s' }} />
                    <div className="absolute bottom-[25%] left-[20%] w-20 h-20 bg-pink-500/10 backdrop-blur-md border border-white/10 rounded-2xl transform rotate-6 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-pulse" style={{ animationDuration: '9s' }} />
                </div>
            </div>
        </div>
    );
}
