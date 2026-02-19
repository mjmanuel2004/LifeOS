import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, CheckCircle, Play, Timer, Calendar, ChevronRight } from 'lucide-react';
import { api } from '../api';
import LiquidCard from '../components/budget/LiquidCard';
import clsx from 'clsx';

const WORKOUT_TEMPLATES = {
    PUSH: { title: 'Push', muscles: 'Pecs, Épaules, Triceps', color: 'from-emerald-400 to-cyan-500', bg: 'bg-emerald-500/10' },
    PULL: { title: 'Pull', muscles: 'Dos, Biceps', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-500/10' },
    LEGS: { title: 'Legs', muscles: 'Quadriceps, Ischios', color: 'from-rose-400 to-orange-500', bg: 'bg-rose-500/10' }
};

export default function Sport() {
    const [activeTab, setActiveTab] = useState('LOG');
    const [selectedTemplate, setSelectedTemplate] = useState('PUSH');
    const [currentSession, setCurrentSession] = useState(null);
    const [history, setHistory] = useState([]);
    const [hydration, setHydration] = useState(1250);

    useEffect(() => { loadHistory(); }, []);

    const loadHistory = async () => {
        try {
            const res = await api.getSeances();
            setHistory(res.data.seances || []);
        } catch (err) { console.error("Erreur DB:", err); }
    };

    const startSession = (key) => {
        const template = WORKOUT_TEMPLATES[key];
        setCurrentSession({
            ...template,
            splitName: key,
            startTime: Date.now(),
            exercices: [/* Tes exos récupérés via l'IA ou la DB ici */],
        });
    };

    return (
        <div className="relative min-h-screen pb-24 px-4 pt-4 overflow-hidden bg-black">
            {/* Aurora Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[30%] bg-emerald-600/10 blur-[100px] rounded-full" />

            <header className="relative z-10 flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Santé</h1>
                    <p className="text-slate-400 text-sm font-medium">M1 MIAGE Performance</p>
                </div>
                <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10">
                    {['LOG', 'HISTORY'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                                activeTab === tab ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {tab === 'LOG' ? 'Séance' : 'Historique'}
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'LOG' ? (
                    <motion.div
                        key="log"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 space-y-6"
                    >
                        {/* Hydration & Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <LiquidCard className="p-5 border-blue-500/30 bg-blue-500/5 backdrop-blur-2xl">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                                        <Droplets size={22} className="text-blue-400" />
                                    </div>
                                    <span className="text-2xl font-black text-white">{hydration}ml</span>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{ width: `${(hydration / 3000) * 100}%` }} />
                                    </div>
                                    <button onClick={() => setHydration(h => Math.min(3000, h + 250))} className="mt-4 w-full py-2 rounded-xl bg-blue-500/20 text-blue-300 text-xs font-bold active:scale-95 transition-all">
                                        + 250ml
                                    </button>
                                </div>
                            </LiquidCard>

                            <LiquidCard className={`p-6 bg-gradient-to-br ${currentSession?.color || 'from-white/5 to-white/5'} backdrop-blur-2xl flex flex-col justify-center items-center text-center`}>
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Dernier Effort</p>
                                <h3 className="text-white font-bold text-lg leading-tight">
                                    {history[0]?.titre || "Prêt ?"}
                                </h3>
                                <p className="text-emerald-400 text-[10px] font-bold mt-1">
                                    {history[0] ? `${history[0].dureeTotale} min` : "Commence ici"}
                                </p>
                            </LiquidCard>
                        </div>

                        {/* Workout Selection */}
                        {!currentSession && (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-3">
                                    {Object.entries(WORKOUT_TEMPLATES).map(([key, value]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedTemplate(key)}
                                            className={clsx(
                                                "relative overflow-hidden p-4 rounded-3xl border transition-all duration-500 group",
                                                selectedTemplate === key
                                                    ? "bg-white/10 border-white/40 scale-[1.02] shadow-2xl shadow-white/5"
                                                    : "bg-white/5 border-white/5 grayscale opacity-60"
                                            )}
                                        >
                                            <div className="flex justify-between items-center relative z-10">
                                                <div className="text-left">
                                                    <p className={`text-sm font-black bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}>
                                                        {key}
                                                    </p>
                                                    <h4 className="text-xl font-bold text-white">{value.title}</h4>
                                                    <p className="text-xs text-slate-400">{value.muscles}</p>
                                                </div>
                                                <ChevronRight className={clsx("transition-transform", selectedTemplate === key ? "text-white" : "text-slate-600")} />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => startSession(selectedTemplate)}
                                    className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Play fill="black" size={20} /> START SESSION
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 relative z-10">
                        {/* Liste historique stylisée */}
                        {history.map((s) => (
                            <div key={s._id} className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10">
                                        <Timer size={20} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{s.titre}</p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{new Date(s.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-black">{s.dureeTotale}'</p>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase">Top Forme</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}