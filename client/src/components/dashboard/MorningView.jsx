import { Droplets, Activity, Coffee, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Widget({ title, children, to, className = '' }) {
    const Content = (
        <div className={`glass-card rounded-[32px] p-6 h-full flex flex-col relative overflow-hidden group active:scale-98 transition-transform ${className}`}>
            <div className="flex justify-between items-center mb-2 relative z-10">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</h2>
            </div>
            <div className="flex-1 relative z-10">{children}</div>
        </div>
    );
    return to ? <Link to={to} className="block h-full">{Content}</Link> : Content;
}

export default function MorningView({ prochainCours }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {/* Workout of the Day (PPL Logic Placeholder) */}
            <div className="lg:col-span-2 lg:row-span-2">
                <Widget title="Sport & Énergie" to="/sport" className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40">
                    <div className="flex flex-col justify-center h-full gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Activity size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Séance Push</h3> // Dynamic later
                                <p className="text-slate-400">Pectoraux, Épaules, Triceps</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">1h15 estimé</span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium text-balance">Recommandé ce matin</span>
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Hydration Tracker */}
            <div className="lg:col-span-1">
                <Widget title="Hydratation" className="bg-blue-900/20">
                    <div className="flex flex-col h-full justify-center items-center">
                        <div className="relative">
                            <Droplets size={32} className="text-blue-400 mb-2" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-white">0.5L</div>
                        <p className="text-xs text-blue-300">Objectif: 2.5L</p>
                        <button className="mt-2 w-full py-1 bg-blue-600/50 hover:bg-blue-600 rounded-lg text-xs font-bold transition-colors">
                            + Un verre
                        </button>
                    </div>
                </Widget>
            </div>

            {/* First Event */}
            <div className="lg:col-span-1">
                <Widget title=" Agenda" to="/calendar" className="bg-[#1c1c1e]">
                    {prochainCours ? (
                        <div className="flex flex-col h-full justify-center">
                            <h3 className="font-bold text-white text-lg leading-tight mb-1">{prochainCours.titre}</h3>
                            <p className="text-sm text-slate-400 flex items-center gap-1">
                                <Clock size={12} /> {new Date(prochainCours.debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">{prochainCours.lieu}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center h-full text-slate-500">
                            <Calendar size={24} className="mb-2 opacity-50" />
                            <p className="text-sm">Rien ce matin</p>
                        </div>
                    )}
                </Widget>
            </div>

            {/* Motivational Quote */}
            <div className="lg:col-span-2">
                <div className="glass-card p-4 rounded-3xl flex items-center justify-center italic text-slate-400 text-sm h-full">
                    "La discipline est mère du succès."
                </div>
            </div>
        </div>
    );
}
