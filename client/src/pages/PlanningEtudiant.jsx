import { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { api } from '../api';
import { Upload, Plus, Trash2, Calendar as CalIcon, Clock, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Journée',
  previous: 'Précédent',
  next: 'Suivant',
  today: "Aujourd'hui",
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Heure',
  event: 'Événement',
  noEventsInRange: 'Aucun événement dans cette plage.',
};

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function PlanningEtudiant() {
  const [evenements, setEvenements] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [icsText, setIcsText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    const now = new Date();
    const debut = new Date(now);
    debut.setMonth(debut.getMonth() - 1);
    const fin = new Date(now);
    fin.setMonth(fin.getMonth() + 3);

    Promise.all([
      api.getEvenements(debut.toISOString(), fin.toISOString()),
      api.getTemplatesEvenements(),
    ])
      .then(([evts, tpl]) => {
        const calEvents = evts.map((e) => ({
          id: e._id,
          title: e.titre,
          start: new Date(e.debut),
          end: new Date(e.fin),
          resource: e,
        }));
        setEvenements(calEvents);
        setTemplates(tpl);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleSelectEvent = (event) => {
    if (window.confirm(`Supprimer l'événement "${event.title}" ?`)) {
      api
        .deleteEvenement(event.resource._id)
        .then(load)
        .catch((e) => setError(e.message));
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setIcsText(r.result || '');
      setShowImport(true);
    };
    r.readAsText(f);
  };

  const handleImportIcs = () => {
    if (!icsText.trim()) return;
    api
      .importIcs(icsText)
      .then(() => {
        setIcsText('');
        setShowImport(false);
        load();
      })
      .catch((e) => setError(e.message));
  };

  const handleCreerDepuisTemplate = (templateId) => {
    api
      .creerEvenementDepuisTemplate(templateId, new Date().toISOString().slice(0, 10))
      .then(load)
      .catch((e) => setError(e.message));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Planning</h1>
          <p className="text-slate-400">Gérez votre emploi du temps universitaire.</p>
        </div>

        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".ics"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 glass-input hover:bg-white/10 text-slate-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Upload size={16} /> Importer .ics
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20">
          {error}
        </div>
      )}

      {showImport && icsText && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel p-4 rounded-xl flex items-center justify-between"
        >
          <p className="text-sm text-slate-300">Fichier chargé prêt à être importé.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setIcsText(''); setShowImport(false); }}
              className="px-3 py-1.5 text-slate-400 hover:text-white text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleImportIcs}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
            >
              Confirmer l'import
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier Principal */}
        <div className="lg:col-span-3 h-[750px] glass-panel p-6 rounded-3xl">
          <style>{`
            .rbc-calendar { color: #e2e8f0; }
            .rbc-toolbar button { border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1;  padding: 8px 16px; border-radius: 8px; font-size: 0.875rem; transition: all 0.2s; background: rgba(255,255,255,0.05); }
            .rbc-toolbar button:hover { background: rgba(255,255,255,0.1); color: white; }
            .rbc-toolbar button.rbc-active { background: #4f46e5; color: white; border-color: #4f46e5; box-shadow: 0 0 15px rgba(79, 70, 229, 0.4); }
            .rbc-header { padding: 12px 4px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; }
            .rbc-day-bg + .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.05); }
            .rbc-time-header-content { border-left: 1px solid rgba(255,255,255,0.05); }
            .rbc-time-content { border-top: 1px solid rgba(255,255,255,0.1); }
            .rbc-timeslot-group { border-bottom: 1px solid rgba(255,255,255,0.05); }
            .rbc-day-slot .rbc-time-slot { border-top: 1px solid rgba(255,255,255,0.02); }
            .rbc-event { background-color: rgba(79, 70, 229, 0.8); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(5px); border-radius: 6px; padding: 2px 6px; font-size: 0.80rem; }
            .rbc-today { background-color: rgba(255,255,255,0.03); }
            .rbc-off-range-bg { background-color: rgba(0,0,0,0.2); }
            .rbc-current-time-indicator { background-color: #ec4899; }
          `}</style>

          <Calendar
            localizer={localizer}
            events={evenements}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            messages={messages}
            defaultView="week"
            views={['month', 'week', 'day']}
            step={30}
            showMultiDayTimes
            onSelectEvent={handleSelectEvent}
            formats={{
              dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd DD/MM', culture),
            }}
          />
        </div>

        {/* Sidebar Templates */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-3xl h-full flex flex-col">
            <h2 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Plus size={16} className="text-indigo-400" /> Templates
            </h2>

            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-10 bg-white/5 rounded-lg"></div>
                <div className="h-10 bg-white/5 rounded-lg"></div>
              </div>
            ) : templates.length === 0 ? (
              <p className="text-xs text-center py-8 text-slate-500 italic border border-white/5 rounded-xl border-dashed">Aucun template configuré.</p>
            ) : (
              <ul className="space-y-2 overflow-y-auto max-h-[400px] flex-1 pr-1 custom-scrollbar">
                {templates.map((t) => (
                  <li key={t._id} className="group flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{t.titre}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-indigo-300">
                        {JOURS[t.jourSemaine]} à {t.heureDebut}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCreerDepuisTemplate(t._id)}
                      className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:bg-indigo-500/20 p-2 rounded-lg transition-all"
                      title="Ajouter au planning"
                    >
                      <Plus size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Nouveau</h3>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  api.createTemplateEvenement({
                    titre: fd.get('titre'),
                    jourSemaine: parseInt(fd.get('jourSemaine'), 10),
                    heureDebut: fd.get('heureDebut'),
                    dureeMinutes: parseInt(fd.get('dureeMinutes'), 10) || 60,
                    lieu: fd.get('lieu') || '',
                  }).then(() => { load(); e.target.reset(); }).catch(e => setError(e.message));
                }}
              >
                <input name="titre" placeholder="Titre du cours" required className="w-full text-xs px-3 py-2.5 rounded-lg glass-input" />

                <div className="grid grid-cols-2 gap-2">
                  <select name="jourSemaine" className="text-xs px-3 py-2.5 rounded-lg glass-input">
                    {JOURS.map((j, i) => <option key={i} value={i === 6 ? 0 : i + 1} className="bg-slate-900">{j}</option>)}
                  </select>
                  <input name="heureDebut" type="time" defaultValue="09:00" className="text-xs px-3 py-2.5 rounded-lg glass-input" />
                </div>

                <input name="dureeMinutes" type="number" placeholder="Durée (min)" defaultValue="60" className="w-full text-xs px-3 py-2.5 rounded-lg glass-input" />
                <input name="lieu" placeholder="Salle / Lieu" className="w-full text-xs px-3 py-2.5 rounded-lg glass-input" />

                <button type="submit" className="w-full text-xs bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-500 transition-colors font-medium shadow-lg shadow-indigo-500/20">Ajouter</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
