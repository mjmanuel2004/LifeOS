import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login({ email, password });

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Erreur lors de la connexion');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col relative overflow-hidden font-serif">

            {/* Organic Yellow Header Section */}
            <div className="relative h-[55vh] w-full shrink-0 z-10">
                {/* Background Image with monochrome yellow filter */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/auth-bg.png')",
                        backgroundColor: '#FFD700', // fallback sunflower yellow
                        backgroundBlendMode: 'multiply'
                    }}
                />

                {/* Wavy organic bottom divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.64,19.33,101.42,42.53,154.2,56.44c56.88,14.77,112.55,14.65,170.81,2Z" fill="#ffffff"></path>
                    </svg>
                </div>

                {/* Vertical Rotated Text */}
                <div className="absolute left-4 top-20 flex origin-bottom-left -rotate-90">
                    <h1 className="text-[4rem] md:text-[5rem] tracking-tight font-bold text-white leading-none whitespace-nowrap">
                        Log in
                    </h1>
                </div>
            </div>

            {/* Bottom Form Section */}
            <div className="flex-1 w-full bg-white relative z-20 -mt-10 px-8 pb-32 flex justify-center">
                <div className="w-full max-w-sm">
                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-sans">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 mt-8">
                        {/* Email Input (Underlined only) */}
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                title="Veuillez entrer une adresse email valide avec un domaine (ex: nom@domaine.com)"
                                className="peer w-full bg-transparent border-b-2 border-gray-200 text-black py-2 px-0 focus:outline-none focus:border-black transition-colors font-sans text-lg placeholder-transparent"
                                placeholder="Email"
                                required
                            />
                            <label className="absolute left-0 -top-5 text-sm font-sans font-medium text-gray-400 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black">
                                Email
                            </label>
                        </div>

                        {/* Password Input (Underlined only) */}
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full bg-transparent border-b-2 border-gray-200 text-black py-2 px-0 focus:outline-none focus:border-black transition-colors font-sans text-lg placeholder-transparent"
                                placeholder="Password"
                                required
                            />
                            <label className="absolute left-0 -top-5 text-sm font-sans font-medium text-gray-400 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-black">
                                Password
                            </label>
                        </div>

                        {/* Remember & Forgot Password */}
                        <div className="flex items-center justify-between mt-6 font-sans">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative w-5 h-5">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-sm peer-checked:bg-black peer-checked:border-black transition-colors ring-offset-2 peer-focus:ring-2 peer-focus:ring-black" />
                                    <svg className="absolute inset-0 w-5 h-5 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-500 group-hover:text-black transition-colors">Remember me</span>
                            </label>

                            <button type="button" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                                Forgot?
                            </button>
                        </div>

                        {/* Social Login and CTA row */}
                        <div className="flex items-end justify-between pt-4 pb-8">
                            <div className="font-sans">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">With G / f OR</p>
                                <div className="flex gap-4">
                                    <button type="button" className="w-12 h-12 rounded-full border border-orange-100 bg-[#FFF3EC] flex items-center justify-center hover:bg-[#FFE5D9] transition-colors">
                                        <svg className="w-5 h-5 text-orange-900" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </button>
                                    <button type="button" className="w-12 h-12 rounded-full border border-orange-100 bg-[#FFF3EC] flex items-center justify-center hover:bg-[#FFE5D9] transition-colors">
                                        <svg className="w-6 h-6 text-orange-900" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-20 h-20 rounded-full bg-[#FFD700] hover:bg-[#e6c200] flex items-center justify-center shadow-2xl transition-transform active:scale-95 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight className="text-black" size={32} strokeWidth={2.5} />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom Nav Toggle Footer */}
            <div className="fixed bottom-0 left-0 w-full flex bg-transparent pointer-events-none z-30">
                <button
                    onClick={() => navigate('/register')}
                    className="pointer-events-auto bg-[#FFD700] text-black font-sans font-bold py-6 px-10 rounded-tr-[40px] shadow-lg flex items-center gap-2 hover:bg-[#e6c200] transition-colors"
                >
                    Sign up
                </button>
            </div>

        </div>
    );
}
