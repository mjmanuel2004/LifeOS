import { motion } from 'framer-motion';

export default function LiquidGauge({ value, max, label, subLabel }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    // Color logic
    let color = "#10b981"; // Emerald-500
    if (percentage > 75) color = "#f59e0b"; // Amber-500
    if (percentage > 90) color = "#ef4444"; // Red-500

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2 px-1">
                <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
                    {subLabel && <p className="text-[10px] text-slate-500">{subLabel}</p>}
                </div>
                <div className="text-right">
                    <span className="text-lg font-bold text-white tabular-nums">{value.toFixed(0)}€</span>
                    <span className="text-xs text-slate-500 ml-1">/ {max}€</span>
                </div>
            </div>

            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    {/* Liquid Wave Effect (CSS Animation) */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse"
                        style={{
                            backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)',
                            backgroundSize: '1rem 1rem'
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
