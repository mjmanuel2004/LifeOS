import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    TrendingUp,
    AlertTriangle,
    Lightbulb,
    PiggyBank,
    Sparkles,
    Loader2,
    DollarSign,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function AIAdvisor() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const now = new Date();
            const res = await fetch(`${API_URL}/ai/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                }),
            });

            const data = await res.json();
            if (data.status === 'success') {
                setAnalysis(data.data);
            } else {
                throw new Error(data.message || "Erreur lors de l'analyse");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Brain className="w-8 h-8 text-purple-400" />
                        Assistant Financier IA
                    </h1>
                    <p className="text-white/60 mt-2">
                        Analysez vos finances et obtenez des conseils personnalisés pour optimiser votre budget.
                    </p>
                </div>
                {!analysis && !loading && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAnalyze}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 flex items-center gap-2 hover:shadow-purple-500/50 transition-all"
                    >
                        <Sparkles className="w-5 h-5" />
                        Lancer l'analyse
                    </motion.button>
                )}
            </header>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {loading && (
                <div className="h-96 flex flex-col items-center justify-center text-white/50 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                    <p className="animate-pulse">L'IA analyse vos transactions...</p>
                </div>
            )}

            {!analysis && !loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-96 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm"
                >
                    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                        <Brain className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Prêt à optimiser votre budget ?</h3>
                    <p className="text-white/60 max-w-md mx-auto mb-6">
                        L'assistant IA va analyser vos revenus et dépenses des 3 derniers mois pour vous proposer
                        des prédictions et des conseils d'investissement.
                    </p>
                    <button
                        onClick={handleAnalyze}
                        className="text-purple-400 hover:text-purple-300 font-medium hover:underline cursor-pointer"
                    >
                        Commencer l'analyse &rarr;
                    </button>
                </motion.div>
            )}

            {analysis && (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* Health Score */}
                    <motion.div
                        variants={item}
                        className="col-span-1 lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-32 h-32 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white/80 mb-4">Score de Santé Financière</h3>
                        <div className="flex items-end gap-2">
                            <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                                {analysis.financialHealthScore}
                            </span>
                            <span className="text-xl text-white/50 mb-2">/100</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.financialHealthScore}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
                            />
                        </div>
                        <p className="mt-4 text-white/60 text-sm">{analysis.predictions}</p>
                    </motion.div>

                    {/* Alerts */}
                    <motion.div
                        variants={item}
                        className="col-span-1 lg:col-span-2 bg-gray-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
                    >
                        <h3 className="text-lg font-medium text-white/80 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Alertes & Attention
                        </h3>
                        <div className="space-y-3">
                            {analysis.alerts.length > 0 ? (
                                analysis.alerts.map((alert, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div
                                            className={cn(
                                                'w-2 h-2 mt-2 rounded-full flex-shrink-0',
                                                alert.severity === 'high'
                                                    ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                                    : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                            )}
                                        />
                                        <div>
                                            <h4 className="text-white font-medium">{alert.category}</h4>
                                            <p className="text-white/60 text-sm mt-1">{alert.message}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white/50 italic">Aucune alerte majeure détectée via l'IA.</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Savings Tips */}
                    <motion.div
                        variants={item}
                        className="col-span-1 lg:col-span-2 bg-gray-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
                    >
                        <h3 className="text-lg font-medium text-white/80 mb-4 flex items-center gap-2">
                            <PiggyBank className="w-5 h-5 text-blue-400" />
                            Conseils d'Épargne
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analysis.savingsTips.map((tip, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20"
                                >
                                    <p className="text-blue-100 text-sm leading-relaxed">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Investment Ideas */}
                    <motion.div
                        variants={item}
                        className="col-span-1 lg:col-span-1 bg-gradient-to-b from-purple-900/40 to-gray-900/40 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-xl"
                    >
                        <h3 className="text-lg font-medium text-white/80 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-purple-400" />
                            Idées d'Investissement
                        </h3>
                        <div className="space-y-3">
                            {analysis.investmentIdeas.map((idea, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-purple-100/80">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    {idea}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <p className="text-xs text-white/30 text-center">
                                Ceci ne constitue pas un conseil financier professionnel. Faites vos propres
                                recherches.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
