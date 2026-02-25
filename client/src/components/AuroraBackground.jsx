import { motion } from 'framer-motion';

const MOODS = {
    calm: {
        orb1: "bg-blue-600/20",
        orb2: "bg-pink-600/20",
        orb3: "bg-cyan-600/20"
    },
    danger: {
        orb1: "bg-red-600/30",
        orb2: "bg-orange-600/30",
        orb3: "bg-rose-900/20"
    },
    focus: {
        orb1: "bg-blue-600/10",
        orb2: "bg-cyan-600/10",
        orb3: "bg-slate-600/10"
    },
    energy: {
        orb1: "bg-yellow-400/20",
        orb2: "bg-orange-500/20",
        orb3: "bg-lime-500/20"
    }
};

export default function AuroraBackground({ children, mood = 'calm' }) {
    const colors = MOODS[mood] || MOODS.calm;

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-slate-100 selection:bg-indigo-500/30 transition-colors duration-1000">
            {/* Aurora Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        x: ["-20%", "20%"],
                        y: ["-20%", "20%"],
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    className={`absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] blur-[100px] rounded-full mix-blend-screen transition-colors duration-1000 ${colors.orb1}`}
                />
                <motion.div
                    animate={{
                        x: ["20%", "-20%"],
                        y: ["10%", "-10%"],
                    }}
                    transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    className={`absolute top-[20%] right-[-10%] w-[60vh] h-[60vh] blur-[120px] rounded-full mix-blend-screen transition-colors duration-1000 ${colors.orb2}`}
                />
                <motion.div
                    animate={{
                        x: ["-10%", "10%"],
                        y: ["20%", "-20%"],
                    }}
                    transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    className={`absolute bottom-[-10%] left-[20%] w-[50vh] h-[50vh] blur-[100px] rounded-full mix-blend-screen transition-colors duration-1000 ${colors.orb3}`}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
