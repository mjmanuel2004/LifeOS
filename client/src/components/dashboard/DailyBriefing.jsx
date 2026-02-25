import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ArrowRight, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../api';

export default function DailyBriefing({ data }) {
    const [briefing, setBriefing] = useState(data);
    const [loading, setLoading] = useState(!data);

    // If no data provided via props, fetch it independently?
    // Or just rely on props if Dashboard handles it. 
    // Let's rely on props for data, but allow independent refresh.

    useEffect(() => {
        if (data) {
            setBriefing(data);
            setLoading(false);
        }
    }, [data]);

    const refresh = async () => {
        setLoading(true);
        try {
            const res = await api.getAIContext();
            if (res.data) setBriefing(res.data);
        } catch (err) { console.error("Failed to load briefing", err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!data && !briefing) refresh();
    }, []);

    if (loading && !briefing) return (
        <div className="w-full h-32 glass-panel rounded-[32px] flex items-center justify-center animate-pulse">
            <Sparkles className="text-blue-400 opacity-50" />
        </div>
    );

    if (!briefing) return null;

    // Determine priority color
    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[32px] p-6 relative overflow-hidden group"
        >
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">Daily Briefing</h2>
                            <p className="text-xs text-slate-400">Contextual Intelligence</p>
                        </div>
                    </div>
                    <button
                        onClick={refresh}
                        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200 mb-1">
                            {briefing.greeting}
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            {briefing.message}
                        </p>
                    </div>

                    {briefing.actionItem && (
                        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${getPriorityColor(briefing.priority)}`}>
                            {briefing.priority === 'high' ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <Zap size={20} className="shrink-0 mt-0.5" />}
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5 block">Action Suggérée</span>
                                <p className="font-semibold text-sm leading-tight">{briefing.actionItem}</p>
                            </div>
                            <button className="ml-auto p-1.5 rounded-full hover:bg-black/10 transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
