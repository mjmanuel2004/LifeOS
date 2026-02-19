import { Utensils, Moon, Wallet, ListChecks } from 'lucide-react';
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

export default function EveningView({ budget, repasSoir }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {/* Meal Plan */}
            <div className="lg:col-span-2 lg:row-span-2">
                <Widget title="Menu du Soir" to="/cuisine" className="bg-gradient-to-br from-orange-900/40 to-slate-900/40">
                    {repasSoir ? (
                        <div className="flex flex-col justify-center h-full gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                                    <Utensils size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white leading-tight">{repasSoir.titre}</h3>
                                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs">25 min</span>
                                        <span className="px-2 py-0.5 rounded bg-white/10 text-xs">Facile</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full justify-center items-center text-slate-500">
                            <Utensils size={40} className="mb-2 opacity-50" />
                            <p>Pas de repas prévu</p>
                        </div>
                    )}
                </Widget>
            </div>

            {/* Budget Recap */}
            <div className="lg:col-span-1">
                <Widget title="Bilan Journée" to="/budget" className="bg-[#1c1c1e]">
                    <div className="flex flex-col h-full justify-center">
                        <span className="text-slate-400 text-xs">Dépenses du jour</span>
                        <span className="text-2xl font-bold text-rose-400">-12.50€</span>
                        <p className="text-xs text-slate-500 mt-1">Déjeuner CROUS + Café</p>
                    </div>
                </Widget>
            </div>

            {/* Preparation for Tomorrow */}
            <div className="lg:col-span-1">
                <Widget title="Demain" to="/calendar" className="bg-[#1c1c1e]">
                    <div className="flex flex-col h-full justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <ListChecks size={20} className="text-blue-400" />
                            <span className="font-bold text-white">Cours à 8h30</span>
                        </div>
                        <p className="text-xs text-slate-400">N'oublie pas ton chargeur Mac.</p>
                    </div>
                </Widget>
            </div>

            {/* Relaxation */}
            <div className="lg:col-span-2">
                <Widget title="Mode Détente" className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <Moon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Prêt pour le repos ?</h4>
                            <p className="text-sm text-slate-400">Pas d'écrans après 23h.</p>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    );
}
