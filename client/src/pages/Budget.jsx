import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CreditCard, ShoppingBag, Home, Plus } from 'lucide-react';
import { api } from '../api';
import LiquidCard from '../components/budget/LiquidCard';
import LiquidGauge from '../components/budget/LiquidGauge';
import clsx from 'clsx';

export default function Budget() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]); // Replaces depenses/revenus separation for fetching
  const [loading, setLoading] = useState(true);

  // Simulation State
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulatedExpense, setSimulatedExpense] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Accounts
      const accRes = await api.getAccounts();

      // If no accounts, maybe trigger a sync/seed for demo purposes?
      // For now, let's just use what we get.
      if (accRes.data.accounts.length === 0) {
        await api.syncAccounts(); // Auto-seed if empty for better UX in simulation
        const retry = await api.getAccounts();
        setAccounts(retry.data.accounts);
      } else {
        setAccounts(accRes.data.accounts);
      }

      // 2. Fetch Transactions
      const txRes = await api.getTransactions();
      setTransactions(txRes.data.transactions);

    } catch (err) {
      console.error("Failed to load budget data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Derived Values
  // Reste à vivre = Sum of "Principal" and "Quotidien" accounts (Cash flow)
  const liquidityAccounts = accounts.filter(a => ['Principal', 'Quotidien', 'Cash'].includes(a.type));
  const totalLiquidity = liquidityAccounts.reduce((sum, a) => sum + a.balance, 0);

  const projectedReste = totalLiquidity - simulatedExpense;

  // Categorize Transactions for proper display
  // We filter by "DEBIT" and simple categories
  const expenses = transactions.filter(t => t.type === 'DEBIT');
  const fixedExpenses = expenses.filter(d => ['Logement', 'Transport', 'Assurances', 'Abonnement'].includes(d.category));
  const variableExpenses = expenses.filter(d => !['Logement', 'Transport', 'Assurances', 'Abonnement'].includes(d.category));

  const totalFixed = fixedExpenses.reduce((sum, d) => sum + d.amount, 0);
  const totalVariable = variableExpenses.reduce((sum, d) => sum + d.amount, 0);

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pb-24 md:pb-0 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Portefeuille</h1>
          <p className="text-slate-400 text-sm">Vue d'ensemble Liquid Data</p>
        </div>
        <button onClick={loadData} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <Plus size={20} className="rotate-45" /> {/* Use as Refresh for now, or just remove */}
        </button>
      </div>

      {/* Account Carousel (Horizontal Snap) */}
      {accounts.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 snap-x no-scrollbar">
          {accounts.map(acc => (
            <div key={acc._id} className="min-w-[280px] snap-center">
              <LiquidCard className={`h-[160px] p-6 flex flex-col justify-between bg-gradient-to-br ${acc.color || 'from-slate-700 to-slate-900'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider">{acc.type}</p>
                    <p className="text-white font-bold text-lg">{acc.name}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <CreditCard size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white tabular-nums">{acc.balance.toFixed(2)}€</p>
                  <p className="text-[10px] text-white/40 mt-1">Géré par Agent Core</p>
                </div>
              </LiquidCard>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-slate-500">Aucun compte connecté.</div>
      )}

      {/* Reste à Vivre & Simulator */}
      <div className="relative group">
        <LiquidCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-lg">Trésorerie Disponible</h2>
            <button
              onClick={() => setSimulationMode(!simulationMode)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-bold transition-all border",
                simulationMode ? "bg-indigo-500 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-slate-400"
              )}
            >
              {simulationMode ? 'Mode Simulation Actif' : 'Activer Simulation'}
            </button>
          </div>

          <div className="mb-6">
            <LiquidGauge
              value={projectedReste}
              max={totalLiquidity * 1.5 || 2000} // Dynamic Max
              label="Disponible"
              subLabel={simulationMode ? `- ${simulatedExpense}€ (Simulé)` : ''}
            />
          </div>

          <AnimatePresence>
            {simulationMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20">
                  <label className="text-xs text-indigo-300 font-bold uppercase mb-2 block">Dépense Fictive</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max={totalLiquidity}
                      step="10"
                      value={simulatedExpense}
                      onChange={(e) => {
                        setSimulatedExpense(parseInt(e.target.value));
                        if (navigator.vibrate) navigator.vibrate(5);
                      }}
                      className="flex-1 accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="min-w-[60px] text-right font-bold text-indigo-400 tabular-nums">
                      {simulatedExpense}€
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LiquidCard>
      </div>

      {/* Smart Segmentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Charges Fixes */}
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 pl-2">Derniers Mouvements (Fixe)</h3>
          <div className="space-y-2">
            {fixedExpenses.length > 0 ? fixedExpenses.slice(0, 5).map(d => (
              <div key={d._id} className="glass-card p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <Home size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">{d.title}</span>
                    <span className="text-[10px] text-slate-500">{new Date(d.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white tabular-nums">-{d.amount}€</span>
              </div>
            )) : (
              <p className="text-xs text-slate-500 italic pl-2">Aucune donnée.</p>
            )}
          </div>
        </div>

        {/* Dépenses Variables */}
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 pl-2">Derniers Plaisirs (Variable)</h3>
          <div className="space-y-2">
            {variableExpenses.length > 0 ? variableExpenses.slice(0, 5).map(d => (
              <div key={d._id} className="glass-card p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <ShoppingBag size={14} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white block">{d.title}</span>
                    <span className="text-[10px] text-slate-500">{d.category}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white tabular-nums">-{d.amount}€</span>
              </div>
            )) : (
              <p className="text-xs text-slate-500 italic pl-2">Aucune donnée.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
