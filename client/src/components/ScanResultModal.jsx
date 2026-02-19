import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, DollarSign, Tag, Store } from 'lucide-react';
import { api } from '../api';

const CATEGORIES = ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Divers'];

export default function ScanResultModal({ result, onClose, onSave }) {
    const [formData, setFormData] = useState(result || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (result) setFormData(result);
    }, [result]);

    if (!result) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const depense = {
                libelle: formData.libelle,
                montant: parseFloat(formData.montant),
                date: formData.date ? new Date(formData.date) : new Date(),
                categorie: formData.categorie,
                mois: new Date(formData.date).getMonth() + 1,
                annee: new Date(formData.date).getFullYear(),
            };

            await api.createDepense(depense);
            onSave(); // Refresh data or notify
        } catch (error) {
            console.error('Error saving expense:', error);
            alert('Erreur lors de la sauvegarde : ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                    <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                        <span>🧾</span> Ticket Analysé
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Commerçant</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={formData.libelle || ''}
                                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Montant (€)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.montant || ''}
                                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-900"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                <input
                                    type="date"
                                    value={formData.date || ''}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Catégorie</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <select
                                value={formData.categorie || 'Divers'}
                                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm appearance-none"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sauvegarde...' : 'Valider'}
                            {!loading && <Check size={16} />}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
