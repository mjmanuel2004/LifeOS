import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Wallet,
    UtensilsCrossed,
    Dumbbell,
    Rocket,
    Settings,
    Sparkles,
    Plus,
    Search,
    CheckCircle,
    CreditCard,
    StickyNote,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
                <div className="flex items-center border-b border-white/10 px-4 py-3">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <Command.Input
                        className="w-full bg-transparent text-white placeholder-slate-400 outline-none text-lg"
                        placeholder="Que cherchez-vous ?"
                    />
                    <div className="flex items-center gap-1 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                        <span className="text-xs">ESC</span>
                    </div>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                    <Command.Empty className="py-6 text-center text-slate-500">
                        Aucun résultat trouvé.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-xs font-semibold text-slate-500 mb-2 px-2 mt-2">
                        <CommandItem
                            icon={LayoutDashboard}
                            text="Dashboard"
                            onSelect={() => runCommand(() => navigate('/'))}
                        />
                        <CommandItem
                            icon={Calendar}
                            text="Planning"
                            onSelect={() => runCommand(() => navigate('/planning-etudiant'))}
                        />
                        <CommandItem
                            icon={Wallet}
                            text="Budget"
                            onSelect={() => runCommand(() => navigate('/budget'))}
                        />
                        <CommandItem
                            icon={UtensilsCrossed}
                            text="Cuisine"
                            onSelect={() => runCommand(() => navigate('/cuisine'))}
                        />
                        <CommandItem
                            icon={Dumbbell}
                            text="Sport"
                            onSelect={() => runCommand(() => navigate('/sport'))}
                        />
                        <CommandItem
                            icon={Rocket}
                            text="Projets"
                            onSelect={() => runCommand(() => navigate('/projets'))}
                        />
                        <CommandItem
                            icon={Sparkles}
                            text="Assistant IA"
                            onSelect={() => runCommand(() => navigate('/ai-advisor'))}
                        />
                    </Command.Group>

                    <Command.Group heading="Actions Rapides" className="text-xs font-semibold text-slate-500 mb-2 px-2 mt-4">
                        <CommandItem
                            icon={CheckCircle}
                            text="Nouvelle Tâche"
                            shortcut="T"
                            onSelect={() => runCommand(() => console.log('Nouvelle Tâche'))}
                        />
                        <CommandItem
                            icon={CreditCard}
                            text="Nouvelle Dépense"
                            shortcut="D"
                            onSelect={() => runCommand(() => console.log('Nouvelle Dépense'))}
                        />
                        <CommandItem
                            icon={StickyNote}
                            text="Nouvelle Note"
                            shortcut="N"
                            onSelect={() => runCommand(() => console.log('Nouvelle Note'))}
                        />
                    </Command.Group>

                    <Command.Group heading="Système" className="text-xs font-semibold text-slate-500 mb-2 px-2 mt-4">
                        <CommandItem
                            icon={Settings}
                            text="Paramètres (Admin)"
                            onSelect={() => runCommand(() => navigate('/admin'))}
                        />
                    </Command.Group>
                </Command.List>
            </motion.div>
        </Command.Dialog>
    );
}

function CommandItem({ icon: Icon, text, shortcut, onSelect }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 aria-selected:bg-white/10 aria-selected:text-white transition-colors cursor-pointer group"
        >
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                <Icon size={18} className="text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <span className="flex-1 font-medium">{text}</span>
            {shortcut && (
                <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{shortcut}</span>
                </div>
            )}
        </Command.Item>
    );
}
