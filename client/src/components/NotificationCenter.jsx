import { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import clsx from 'clsx';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadNotifications = () => {
        api.getNotifications()
            .then(data => {
                setNotifications(data);
                setUnreadCount(data.length);
            })
            .catch(console.error);
    };

    useEffect(() => {
        loadNotifications();
        // Poll every 60s
        const interval = setInterval(loadNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = (id) => {
        api.markNotificationRead(id).then(() => {
            setNotifications(prev => prev.filter(n => n._id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
        });
    };

    const handleClearAll = () => {
        api.clearNotifications().then(() => {
            setNotifications([]);
            setUnreadCount(0);
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                        >
                            <div className="p-3 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-semibold text-white text-sm">Notifications</h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1"
                                    >
                                        <Trash2 size={12} /> Tout effacer
                                    </button>
                                )}
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        Aucune notification
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-white/5">
                                        {notifications.map((notif) => (
                                            <li key={notif._id} className="p-3 hover:bg-white/5 transition-colors group">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={clsx(
                                                                "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                                                                notif.type === 'budget_alert' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                                                            )}>
                                                                {notif.type === 'budget_alert' ? 'Budget' : 'Info'}
                                                            </span>
                                                            <span className="text-xs text-slate-500">
                                                                {new Date(notif.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-300 leading-snug">{notif.message}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleMarkRead(notif._id)}
                                                        className="p-1 text-slate-500 hover:text-green-400 hover:bg-green-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Marquer comme lu"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
