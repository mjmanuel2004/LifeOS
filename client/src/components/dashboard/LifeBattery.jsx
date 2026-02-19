import { motion } from 'framer-motion';
import { Battery, BatteryCharging, BatteryWarning, Activity, Wallet, Brain } from 'lucide-react';

export default function LifeBattery({ data }) {
    if (!data) return null;

    const { score, status, physical, mental, financial } = data;

    const getScoreColor = (s) => {
        if (s >= 80) return 'text-emerald-400';
        if (s >= 50) return 'text-blue-400';
        return 'text-rose-400';
    };

    const getBarColor = (s) => {
        if (s >= 80) return 'bg-emerald-500';
        if (s >= 50) return 'bg-blue-500';
        return 'bg-rose-500';
    };

    return (
        <div className="glass-panel p-6 rounded-[32px] flex flex-col justify-between h-full relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 ${getBarColor(score)}`} />

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <BatteryCharging size={18} className="text-yellow-400" />
                        Life Battery
                    </h3>
                    <p className="text-xs text-slate-400">Niveau d'énergie global</p>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                </div>
            </div>

            {/* Main Battery Visual */}
            <div className="flex-1 flex items-center justify-center my-4 relative z-10">
                <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${getBarColor(score)} shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
                    />
                </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 relative z-10">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-400">
                        <Activity size={14} />
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Physique</div>
                    <div className={`text-xs font-bold ${getScoreColor(physical)}`}>{physical}%</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400">
                        <Brain size={14} />
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Mental</div>
                    <div className={`text-xs font-bold ${getScoreColor(mental)}`}>{mental}%</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400">
                        <Wallet size={14} />
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Finances</div>
                    <div className={`text-xs font-bold ${getScoreColor(financial)}`}>{financial}%</div>
                </div>
            </div>
        </div>
    );
}
