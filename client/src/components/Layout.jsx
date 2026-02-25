import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  UtensilsCrossed,
  Dumbbell,
  Rocket,
  Settings,
  Menu,
  X,
  Plus,
  MoreHorizontal,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import CommandPalette from './CommandPalette';
import ScanResultModal from './ScanResultModal';
import NotificationCenter from './NotificationCenter';
import AuroraBackground from './AuroraBackground';
import useCoreIntelligence from '../hooks/useCoreIntelligence';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendrier', icon: Calendar },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/cuisine', label: 'Cuisine', icon: UtensilsCrossed },
  { to: '/sport', label: 'Sport', icon: Dumbbell },
  { to: '/projets', label: 'Projets', icon: Rocket },
  { to: '/ai-advisor', label: 'Assistant IA', icon: Settings },
];

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // CIA Integration
  const { mood, greeting, dashboardConfig } = useCoreIntelligence();

  const handleScan = async (file) => {
    setIsScanning(true);
    try {
      const res = await api.scanTicket(file);
      setScanResult(res.data);
    } catch (e) {
      alert('Erreur scan: ' + e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const MobileTabItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <NavLink
        to={to}
        className={({ isActive }) => clsx(
          "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-90 transition-transform",
          isActive ? "text-blue-500" : "text-slate-400"
        )}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </NavLink>
    );
  };

  return (
    <AuroraBackground mood={mood}>
      <div className="flex min-h-screen text-slate-100 selection:bg-blue-500/30 font-sans">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-72 fixed inset-y-0 left-0 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50">
          <div className="p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <h1 className="font-bold text-xl tracking-tight text-white">
                LifeOS
              </h1>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    clsx(
                      'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                      isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    )
                  }
                >
                  <Icon size={20} className={clsx(isActive ? 'text-blue-400' : 'group-hover:text-blue-300 transition-colors')} />
                  <span className="font-medium tracking-wide text-sm">{label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="px-6 pb-2">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notifications</span>
              <NotificationCenter />
            </div>
          </div>

          <div className="p-4 mt-auto flex flex-col gap-3">
            {/* Profile Button */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 w-full py-3 rounded-xl transition-colors font-medium px-4 border border-white/5',
                  isActive ? 'bg-white/10 text-white' : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Settings size={18} />
              <span>Mon Profil</span>
            </NavLink>

            {/* Scan Button on Desktop Sidebar */}
            <label className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer transition-colors font-medium shadow-lg shadow-blue-900/20">
              <Plus size={18} />
              <span>Scanner un ticket</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleScan(e.target.files[0])} />
            </label>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors font-medium"
            >
              <LogOut size={18} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-72 pb-24 md:pb-8 min-h-screen w-full overflow-x-hidden">
          {/* Mobile Header (Minimal) */}
          <div className="md:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between bg-black/50 backdrop-blur-xl border-b border-white/5">
            <h1 className="text-lg font-bold tracking-tight">LifeOS</h1>
            <div className="flex items-center gap-3">
              <NotificationCenter />
              {/* Camera Action for Mobile */}
              <label className="p-2 rounded-full bg-blue-600 text-white active:scale-95 transition-transform cursor-pointer">
                <Plus size={20} />
                <input type="file" accept="image/*,capture=camera" className="hidden" onChange={(e) => e.target.files?.[0] && handleScan(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet context={{ mood, greeting, dashboardConfig }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* ... Mobile Tab Bar and Modals ... */}
        {/* (Rest of the file structure needs to be maintained, I will rely on the closing tags being correct from previous) */}


        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 h-[84px] pb-5 glass-tab-bar z-50 flex items-center justify-around px-2">
          <MobileTabItem to="/" icon={LayoutDashboard} label="Accueil" />
          <MobileTabItem to="/calendar" icon={Calendar} label="Agenda" />
          <MobileTabItem to="/budget" icon={Wallet} label="Budget" />
          <MobileTabItem to="/cuisine" icon={UtensilsCrossed} label="Cuisine" />

          {/* More Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={clsx(
              "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-90 transition-transform text-slate-400"
            )}
          >
            <MoreHorizontal size={24} />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </nav>

        {/* Mobile More Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 inset-x-0 z-50 bg-[#1c1c1e] rounded-t-[32px] overflow-hidden border-t border-white/10 pb-10"
              >
                <div className="p-4 flex justify-between items-center border-b border-white/5">
                  <h2 className="text-lg font-bold ml-2">Menu</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full text-slate-400">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 grid grid-cols-4 gap-4">
                  <NavLink to="/sport" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 active:bg-white/10">
                    <Dumbbell className="text-purple-400" />
                    <span className="text-xs">Sport</span>
                  </NavLink>
                  <NavLink to="/projets" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 active:bg-white/10">
                    <Rocket className="text-pink-400" />
                    <span className="text-xs">Projets</span>
                  </NavLink>
                  <NavLink to="/ai-advisor" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 active:bg-white/10">
                    <Settings className="text-cyan-400" />
                    <span className="text-xs">Assistant</span>
                  </NavLink>
                  <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-red-500/10 active:bg-red-500/20 text-red-500">
                    <LogOut size={24} />
                    <span className="text-xs">Quitter</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <CommandPalette />

        {isScanning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-[#1c1c1e] p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-white/10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white font-medium">Analyse en cours...</p>
            </div>
          </div>
        )}

        <ScanResultModal
          result={scanResult}
          onClose={() => setScanResult(null)}
          onSave={() => {
            setScanResult(null);
          }}
        />
      </div>
    </AuroraBackground>
  );
}
