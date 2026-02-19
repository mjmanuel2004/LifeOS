import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useOutletContext, Link } from 'react-router-dom';
import { TrendingUp, Calendar, Utensils, ShoppingCart, Activity, Clock, MapPin, ArrowRight, Wallet, Rocket } from 'lucide-react';
import clsx from 'clsx';
import SmartWidgetEngine from '../components/widgets/SmartWidgetEngine';
import DailyBriefing from '../components/dashboard/DailyBriefing';
import LifeBattery from '../components/dashboard/LifeBattery';
import MorningView from '../components/dashboard/MorningView';
import DayView from '../components/dashboard/DayView';
import EveningView from '../components/dashboard/EveningView';

function Widget({ title, children, to, className = '', delay = 0 }) {
  const Content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={clsx(
        'glass-card rounded-[32px] p-6 h-full flex flex-col relative overflow-hidden group active:scale-98 transition-transform',
        className
      )}
    >
      <div className="flex justify-between items-center mb-2 relative z-10">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</h2>
        {to && <ArrowRight size={14} className="text-white/50 group-hover:text-white transition-colors" />}
      </div>
      <div className="flex-1 relative z-10">{children}</div>
    </motion.div>
  );

  return to ? <Link to={to} className="block h-full">{Content}</Link> : Content;
}

export default function Dashboard() {
  // CIA Context from Layout
  const { mood, greeting, dashboardConfig } = useOutletContext();

  const [budget, setBudget] = useState(null);
  const [prochainCours, setProchainCours] = useState(null);
  const [repasSoir, setRepasSoir] = useState(null);
  const [briefingData, setBriefingData] = useState(null); // Helper state for shared data
  const [loading, setLoading] = useState(true);

  // Fallback "Mode" derivation for standard views
  const hour = new Date().getHours();
  const mode = hour < 11 ? 'morning' : (hour < 18 ? 'day' : 'evening');

  const mois = new Date().getMonth() + 1;
  const annee = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, cours, plan] = await Promise.all([
          api.getBudgetMensuel(mois, annee).catch(() => null),
          api.getProchainCours().catch(() => null),
          api.getPlanningSemaine(new Date().toISOString()).catch(() => null),
        ]);

        setBudget(b);
        setProchainCours(cours);

        if (plan && plan.slots) {
          const today = new Date().getDay();
          const jourIndex = today === 0 ? 6 : today - 1;
          const slot = plan.slots.find((s) => s.jour === jourIndex);
          if (slot && slot.recetteId) {
            try {
              const recette = await api.getRecette(slot.recetteId);
              setRepasSoir(recette);
            } catch (e) {
              console.error(e);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mois, annee]);

  // Note: DailyBriefing component fetches its own data, but we could lift state up if we want to share the "LifeBattery" data which comes from the same API call.
  // For now, let's let DailyBriefing handle the fetch and we can refactor later or pass a callback.
  // Actually, to display LifeBattery here, we need the data.
  // Let's modify DailyBriefing to accept `onDataLoaded` prop or fetch here.
  // For simplicity, let's fetch Context here in Dashboard so both widgets use it.

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await api.getAIContext();
        if (res.data) setBriefingData(res.data);
      } catch (e) { console.error(e); }
    };
    fetchContext();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="px-1 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-1"
        >
          <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${mood === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} />
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
            Agent Core Active
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white mt-1 tracking-tight"
        >
          {greeting || 'Bonjour Emmanuel'}.
        </motion.h1>
      </header>

      {/* NEW: Contextual Daily Briefing & Life Battery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <DailyBriefing data={briefingData} />
        </div>
        <div className="lg:col-span-1">
          <LifeBattery data={briefingData?.lifeBattery} />
        </div>
      </div>

      {/* OLD: SmartWidgetEngine (Optional, keeping for now or removing if redundant) */}
      {/* {dashboardConfig && dashboardConfig.length > 0 && (
        <div className="mb-6">
          <SmartWidgetEngine config={dashboardConfig} />
        </div>
      )} */}

      {/* Standard Contextual Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {mode === 'morning' && <MorningView prochainCours={prochainCours} />}
          {mode === 'day' && <DayView budget={budget} prochainCours={prochainCours} />}
          {mode === 'evening' && <DayView budget={budget} prochainCours={prochainCours} />}
        </motion.div>
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* Budget Card - Large */}
        <div className="lg:col-span-2">
          <Widget title="Budget Mensuel" to="/budget" className="bg-gradient-to-br from-blue-900/40 to-slate-900/40" delay={0.1}>
            <div className="flex flex-col justify-between h-full pt-2">
              <div>
                <span className="text-slate-400 text-sm">Reste à vivre</span>
                <div className="text-5xl font-bold text-white tracking-tighter mt-1">
                  {budget?.resteAVivre != null ? `${budget.resteAVivre.toFixed(0)}€` : '—'}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <div className="px-4 py-3 bg-white/5 rounded-2xl flex-1 border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Entrées</div>
                  <div className="text-lg font-semibold text-emerald-400">+{budget?.totalRevenus}€</div>
                </div>
                <div className="px-4 py-3 bg-white/5 rounded-2xl flex-1 border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Sorties</div>
                  <div className="text-lg font-semibold text-rose-400">-{budget?.totalDepenses}€</div>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        {/* Planning Card */}
        <div className="lg:col-span-1">
          <Widget title="Prochainement" to="/calendar" delay={0.2} className="bg-gradient-to-br from-[#1c1c1e] to-black/50">
            {prochainCours ? (
              <div className="flex flex-col h-full justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">{prochainCours.titre}</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {new Date(prochainCours.debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {prochainCours.lieu && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><MapPin size={10} /> {prochainCours.lieu}</p>}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <p className="text-sm">Rien de prévu</p>
              </div>
            )}
          </Widget>
        </div>

        {/* Cuisine Card */}
        <div className="lg:col-span-1">
          <Widget title="Ce soir" to="/cuisine" delay={0.3} className="bg-gradient-to-br from-[#1c1c1e] to-black/50">
            {repasSoir ? (
              <div className="flex flex-col h-full justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <Utensils size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">{repasSoir.titre}</h3>
                  <p className="text-slate-400 text-sm mt-1 block">Bon appétit !</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <p className="text-sm">Pas de menu défini</p>
              </div>
            )}
          </Widget>
        </div>
      </div>


    </div>
  );
}
