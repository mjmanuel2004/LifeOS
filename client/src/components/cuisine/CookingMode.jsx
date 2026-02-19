import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';

export default function CookingMode({ recipe, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = recipe.etapes || [];
    const progress = ((currentStep + 1) / steps.length) * 100;

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
        else onClose(); // Finish
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-green-500">Cooking Mode</span>
                </div>
                <button onClick={onClose} className="p-3 bg-white/10 rounded-full active:scale-90 transition-transform">
                    <X size={24} className="text-white" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/10 w-full">
                <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col p-6 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex-1 flex flex-col justify-center"
                    >
                        <h2 className="text-[120px] font-black text-white/5 absolute top-10 right-4 select-none">
                            {currentStep + 1}
                        </h2>

                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                            {steps[currentStep]}
                        </h3>
                    </motion.div>
                </AnimatePresence>

                {/* Hint / Timer Placeholder */}
                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 uppercase font-bold">Conseil IA</p>
                        <p className="text-white font-medium">Prends ton temps, le feu doit être moyen.</p>
                    </div>
                </div>
            </div>

            {/* Navigation Controls (Bottom Fixed) */}
            <div className="p-6 grid grid-cols-2 gap-4 bg-black border-t border-white/10">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="h-24 rounded-3xl bg-white/10 flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all text-white"
                >
                    <ChevronLeft size={48} />
                </button>
                <button
                    onClick={nextStep}
                    className={`h-24 rounded-3xl flex items-center justify-center active:scale-95 transition-all text-white font-bold text-xl gap-2 ${currentStep === steps.length - 1 ? 'bg-green-600' : 'bg-blue-600'}`}
                >
                    {currentStep === steps.length - 1 ? (
                        <>Terminer <CheckCircle size={32} /></>
                    ) : (
                        <>Suivant <ChevronRight size={48} /></>
                    )}
                </button>
            </div>
        </div>
    );
}
