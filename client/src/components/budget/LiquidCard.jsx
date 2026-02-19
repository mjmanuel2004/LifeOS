import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function LiquidCard({ children, className = '', onClick }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={clsx(
                "relative overflow-hidden rounded-[32px]",
                "bg-white/5 backdrop-blur-2xl",
                "border border-white/10",
                "shadow-2xl shadow-black/20",
                className
            )}
            style={{
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
            }}
        >
            {/* Liquid Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
