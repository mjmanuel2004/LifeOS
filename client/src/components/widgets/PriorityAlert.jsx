import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, XCircle, ArrowRight } from 'lucide-react';

export default function PriorityAlert({ data, onDismiss }) {
    const { title, message, actionLabel, onAction, severity = 'critical' } = data;

    const colors = {
        critical: 'from-red-900/90 to-black',
        warning: 'from-orange-900/90 to-black',
        info: 'from-blue-900/90 to-black'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gradient-to-b ${colors[severity]} backdrop-blur-3xl`}
        >
            <div className="max-w-md w-full text-center space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center border-4 border-red-500 animate-pulse"
                >
                    <AlertOctagon size={48} className="text-red-500" />
                </motion.div>

                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                        {title}
                    </h2>
                    <p className="text-lg text-white/80 font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="pt-8 space-y-4">
                    {actionLabel && (
                        <button
                            onClick={onAction}
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            {actionLabel} <ArrowRight size={20} />
                        </button>
                    )}

                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-white/40 text-sm font-semibold hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <XCircle size={16} /> Ignorer pour l'instant
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
