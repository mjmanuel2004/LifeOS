import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import LiquidCard from '../budget/LiquidCard';

export default function SmartSuggestion({ data }) {
    const { title, description, icon: Icon, color = "blue" } = data;

    const colors = {
        blue: "from-blue-500/20 to-indigo-900/20 border-blue-500/20",
        green: "from-emerald-500/20 to-teal-900/20 border-emerald-500/20",
        purple: "from-purple-500/20 to-fuchsia-900/20 border-purple-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
        >
            <LiquidCard className={`p-5 h-full bg-gradient-to-br ${colors[color] || colors.blue}`}>
                <div className="flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-white/10 rounded-xl">
                            {Icon ? <Icon size={20} className="text-white" /> : <Sparkles size={20} className="text-white" />}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 px-2 py-1 rounded">
                            Suggestion IA
                        </span>
                    </div>

                    <div>
                        <h4 className="font-bold text-white text-lg leading-tight mb-1">{title}</h4>
                        <p className="text-sm text-slate-300 line-clamp-2">{description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-white/70 group cursor-pointer hover:text-white transition-colors">
                        Voir les détails <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </LiquidCard>
        </motion.div>
    );
}
