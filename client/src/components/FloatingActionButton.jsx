import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, CreditCard, StickyNote, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton({ onScan }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    const actions = [
        {
            icon: Camera,
            label: 'Scanner',
            color: 'bg-blue-500',
            onClick: () => fileInputRef.current?.click(),
        },
        {
            icon: StickyNote,
            label: 'Note',
            color: 'bg-yellow-500',
            onClick: () => console.log('Add Note'),
        },
        {
            icon: CreditCard,
            label: 'Dépense',
            color: 'bg-red-500',
            onClick: () => console.log('Add Expense'),
        },
        {
            icon: CheckCircle,
            label: 'Tâche',
            color: 'bg-green-500',
            onClick: () => console.log('Add Task'),
        },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onScan) {
                        onScan(file);
                        setIsOpen(false);
                    }
                    e.target.value = '';
                }}
            />

            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 mb-2">
                        {actions.map((action, index) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => {
                                    action.onClick();
                                    if (action.label !== 'Scanner') setIsOpen(false);
                                }}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {action.label}
                                </span>
                                <div
                                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white ${action.color} hover:brightness-110 transition-all`}
                                >
                                    <action.icon size={20} />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 ${isOpen ? 'bg-slate-600 rotate-45' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                    }`}
            >
                <Plus size={28} />
            </motion.button>
        </div>
    );
}
