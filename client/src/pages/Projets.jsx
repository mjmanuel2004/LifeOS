import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Code, Server, BookOpen, CheckCircle, Clock, Plus, Briefcase, Plane, GraduationCap } from 'lucide-react';
import { api } from '../api';
import LiquidCard from '../components/budget/LiquidCard';

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'etudes': return GraduationCap;
    case 'business': return Briefcase;
    case 'voyage': return Plane;
    default: return Rocket; // perso
  }
};

const getCategoryLabel = (cat) => {
  switch (cat) {
    case 'etudes': return 'Université';
    case 'business': return 'Business';
    case 'voyage': return 'Voyage';
    default: return 'Perso';
  }
};

export default function Projets() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjets = async () => {
    setLoading(true);
    try {
      const res = await api.getProjets();
      if (res.data.projets.length === 0) {
        await api.seedProjets();
        const retry = await api.getProjets();
        setProjets(retry.data.projets);
      } else {
        setProjets(res.data.projets);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjets(); }, []);

  // Helper to calculate progress if not in DB, or use existing logic
  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const done = tasks.filter(t => t.statut === 'termine').length;
    return Math.round((done / tasks.length) * 100);
  };

  return (
    <div className="pb-24 md:pb-0 space-y-6">
      <header className="px-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Productivité</h1>
          <p className="text-slate-400 text-sm">Projets & Deadlines</p>
        </div>
        <button className="p-2 bg-white/10 rounded-full text-white active:scale-90 transition-transform">
          <Plus size={20} />
        </button>
      </header>

      {/* Focus Mode Timer (Placeholder) */}
      <LiquidCard className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 flex items-center justify-center">
            <span className="font-mono font-bold text-white">25:00</span>
          </div>
          <div>
            <h3 className="font-bold text-white">Mode Focus</h3>
            <p className="text-xs text-slate-400">Prêt pour une session de Deep Work ?</p>
          </div>
        </div>
        <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <Clock size={20} className="text-indigo-300" />
        </button>
      </LiquidCard>

      {/* Project List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projets.map(projet => {
            const Icon = getCategoryIcon(projet.categorie);
            const progress = calculateProgress(projet.taches);

            return (
              <LiquidCard key={projet._id} className="p-5 flex flex-col h-full border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: `${projet.couleur}33`, color: projet.couleur }} // 33 = 20% opacity hex
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{projet.titre}</h4>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded bg-white/5">
                        {getCategoryLabel(projet.categorie)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white tabular-nums">{progress}%</span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full"
                    style={{ backgroundColor: projet.couleur }}
                  />
                </div>

                {/* Tasks Preview */}
                <div className="space-y-2 mt-auto">
                  {projet.taches && projet.taches.slice(0, 3).map((task, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${task.statut === 'termine' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}
                      >
                        {task.statut === 'termine' && <CheckCircle size={10} className="text-black" />}
                      </div>
                      <span className={task.statut === 'termine' ? 'text-slate-500 line-through' : 'text-slate-300'}>
                        {task.titre}
                      </span>
                    </div>
                  ))}
                </div>
              </LiquidCard>
            );
          })}
        </div>
      )}

      {/* Quick Add FAB (Mobile) */}
      <div className="fixed bottom-24 right-4 md:hidden">
        <button className="w-14 h-14 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/40 flex items-center justify-center text-white active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
