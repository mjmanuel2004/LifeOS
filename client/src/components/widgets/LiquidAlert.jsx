import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import LiquidCard from '../budget/LiquidCard';

export default function LiquidAlert({ data, onDismiss }) {
    const { title, message, actionLabel, onAction } = data;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-4"
        >
            <LiquidCard className="p-4 bg-gradient-to-r from-red-900/40 to-orange-900/40 border-red-500/30 shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/20 rounded-full animate-pulse">
                        <AlertTriangle className="text-red-400" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                        <p className="text-slate-200 text-sm mt-1">{message}</p>

                        {actionLabel && (
                            <button
                                onClick={onAction}
                                className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold text-white transition-colors w-full sm:w-auto"
                            >
                                {actionLabel}
                            </button>
                        )}
                    </div>
                    {onDismiss && (
                        <button onClick={onDismiss} className="text-white/50 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </LiquidCard>
        </motion.div>
    );
}
