import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { api } from '../api';
import clsx from 'clsx';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [items, setItems] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date()); // Selected Date object
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const loadItems = async () => {
        setLoading(true);
        const start = new Date(year, month - 1, 1).toISOString();
        const end = new Date(year, month + 2, 0).toISOString();

        try {
            const items = await api.getCalendarItems(start, end);
            // Check if we have any "real" events (type 'event') to decide if we need to seed
            // Note: getCalendarItems returns mixed types. We only seed if *Events* are missing, mostly.
            const hasEvents = items.some(i => i.type === 'event');

            if (!hasEvents) {
                await api.seedEvents();
                const retry = await api.getCalendarItems(start, end);
                setItems(retry);
            } else {
                setItems(items);
            }
        } catch (err) {
            console.error("Failed to load calendar", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, [currentDate]);

    // Helpers
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const today = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDay(now);
    };

    const getItemsForDate = (date) => {
        const dateStr = date.toDateString();
        return items.filter(item => new Date(item.start).toDateString() === dateStr);
    };

    // --- Mobile Agenda View ---
    // Generate days for the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    const MobileView = () => (
        <div className="flex flex-col gap-4 pb-20">
            {/* Horizontal Day Selector */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 flex gap-3 no-scrollbar snap-x">
                {daysArray.map((date) => {
                    const isSelected = date.toDateString() === selectedDay.toDateString();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const hasEvents = getItemsForDate(date).length > 0;

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDay(date)}
                            className={clsx(
                                "flex flex-col items-center justify-center min-w-[50px] h-[70px] rounded-2xl snap-center transition-all",
                                isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-[#1c1c1e] text-slate-400 border border-white/5",
                                isToday && !isSelected && "border-blue-500/50 text-blue-400"
                            )}
                        >
                            <span className="text-[10px] uppercase font-bold">{date.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3)}</span>
                            <span className="text-xl font-bold">{date.getDate()}</span>
                            {hasEvents && <div className={clsx("w-1 h-1 rounded-full mt-1", isSelected ? "bg-white" : "bg-blue-500")} />}
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Agenda */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white px-1">
                    {selectedDay.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>

                {getItemsForDate(selectedDay).length > 0 ? (
                    getItemsForDate(selectedDay).map(item => (
                        <div key={item.id} className="glass-card p-4 rounded-2xl flex gap-4 border-l-4" style={{ borderLeftColor: item.color }}>
                            <div className="flex flex-col items-center justify-center text-slate-400 w-12 border-r border-white/5 pr-4">
                                <span className="text-xs font-bold">{new Date(item.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                <div className="h-full w-[1px] bg-white/5 my-1" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">{item.title}</h4>
                                {item.details?.lieu && (
                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <MapPin size={10} /> {item.details.lieu}
                                    </p>
                                )}
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-2 block bg-white/5 w-fit px-2 py-0.5 rounded">
                                    {item.type}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Clock size={20} className="opacity-50" />
                        </div>
                        <p>Rien de prévu ce jour-là</p>
                    </div>
                )}
            </div>
        </div>
    );

    // --- Desktop Grid View --- (Simplified from previous version, kept for larger screens)
    const DesktopView = () => {
        const firstDay = new Date(year, month, 1).getDay() || 7; // 1=Mon, 7=Sun
        const blanks = Array(firstDay - 1).fill(null);

        return (
            <div className="glass-panel rounded-3xl p-6 border border-white/10 h-full flex flex-col">
                <div className="grid grid-cols-7 mb-4">
                    {DAYS_SHORT.map(d => <div key={d} className="text-center text-slate-500 text-sm font-bold uppercase">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 flex-1 gap-2 overflow-y-auto">
                    {blanks.map((_, i) => <div key={`b-${i}`} />)}
                    {daysArray.map(date => {
                        const dayItems = getItemsForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                            <div key={date} className={clsx("min-h-[100px] border rounded-xl p-2 transition-colors", isToday ? "border-blue-500/50 bg-blue-500/10" : "border-white/5 hover:bg-white/5 bg-[#1c1c1e]")}>
                                <div className="flex justify-between">
                                    <span className={clsx("font-bold text-sm h-6 w-6 flex items-center justify-center rounded-full", isToday ? "bg-blue-500 text-white" : "text-slate-400")}>{date.getDate()}</span>
                                </div>
                                <div className="mt-1 space-y-1">
                                    {dayItems.slice(0, 3).map(item => (
                                        <div key={item.id} className="text-[10px] px-1.5 py-0.5 rounded truncate text-white/90" style={{ backgroundColor: item.color + '80' }}>
                                            {item.title}
                                        </div>
                                    ))}
                                    {dayItems.length > 3 && <span className="text-[10px] text-slate-500">+{dayItems.length - 3}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white capitalize">
                    {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h1>
                <div className="flex gap-1 bg-[#1c1c1e] p-1 rounded-xl border border-white/10">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-300"><ChevronLeft size={20} /></button>
                    <button onClick={today} className="px-3 py-1 text-xs font-bold text-white hover:bg-white/10 rounded-lg">Aujourd&apos;hui</button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-slate-300"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* View Switcher via CSS hidden */}
            <div className="md:hidden flex-1">
                <MobileView />
            </div>
            <div className="hidden md:block flex-1 h-[600px]">
                <DesktopView />
            </div>
        </div>
    );
}
