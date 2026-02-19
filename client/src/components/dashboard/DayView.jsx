import { Rocket, CheckCircle, Wallet } from 'lucide-react';
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

export default function DayView({ budget, prochainCours }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {/* Focus Principal: Projets */}
            <div className="lg:col-span-2 lg:row-span-2">
                <Widget title="Focus Actuel" to="/projets" className="bg-gradient-to-br from-blue-900/40 to-slate-900/40">
                    <div className="flex flex-col justify-center h-full gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Rocket size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">MAISON Makara</h3>
                                <p className="text-slate-400">Prochaine étape : Déploiement V1</p>
                            </div>
                        </div>
                        {/* Progress Mockup */}
                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Progression globale</span>
                                <span>75%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-3/4 rounded-full" />
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Quick Task */}
            <div className="lg:col-span-1">
                <Widget title="Tâche Prioritaire" className="bg-[#1c1c1e]">
                    <div className="flex flex-col h-full justify-center">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-500 flex-shrink-0" />
                            <p className="text-white font-medium">Réviser le cours de Java/JPA</p>
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Budget Quick Look */}
            <div className="lg:col-span-1">
                <Widget title="Budget Quotidien" to="/budget" className="bg-[#1c1c1e]">
                    <div className="flex flex-col h-full justify-center">
                        <span className="text-slate-400 text-xs">Reste aujourd'hui</span>
                        <span className="text-2xl font-bold text-white">45.00€</span>
                        <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                            <Wallet size={12} /> Dépenses sous contrôle
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Agenda / Next Event */}
            <div className="lg:col-span-2">
                <Widget title="Prochainement" to="/calendar" className="bg-[#1c1c1e]">
                    {prochainCours ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Rocket size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{prochainCours.titre}</h3>
                                <p className="text-sm text-slate-400">
                                    {new Date(prochainCours.debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {prochainCours.lieu}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500">Rien de prévu pour le moment.</p>
                    )}
                </Widget>
            </div>
        </div>
    );
}
