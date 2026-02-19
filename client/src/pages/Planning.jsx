import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Planning() {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  const load = () => {
    api
      .getTaches()
      .then(setTaches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titre.trim()) return;
    api
      .createTache({ titre: titre.trim(), description: description.trim() })
      .then(() => {
        setTitre('');
        setDescription('');
        load();
      })
      .catch((e) => setError(e.message));
  };

  const toggleTerminee = (t) => {
    api
      .updateTache(t._id, { terminee: !t.terminee })
      .then(load)
      .catch((e) => setError(e.message));
  };

  const handleDelete = (id) => {
    api
      .deleteTache(id)
      .then(load)
      .catch((e) => setError(e.message));
  };

  if (loading) return <div className="p-6 text-gray-500">Chargement…</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Planning</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Nouvelle tâche</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="text"
            placeholder="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700"
          >
            Ajouter
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {taches.map((t) => (
          <li
            key={t._id}
            className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3"
          >
            <button
              type="button"
              onClick={() => toggleTerminee(t)}
              className="shrink-0 w-6 h-6 rounded border border-gray-300 flex items-center justify-center"
            >
              {t.terminee && <span className="text-green-600">✓</span>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={t.terminee ? 'line-through text-gray-500' : 'text-gray-800'}>
                {t.titre}
              </p>
              {t.description && <p className="text-xs text-gray-500 truncate">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(t._id)}
              className="text-red-600 text-sm shrink-0"
            >
              Suppr.
            </button>
          </li>
        ))}
      </ul>
      {taches.length === 0 && (
        <p className="text-gray-500 text-sm mt-2">Aucune tâche. Ajoutez-en ci-dessus.</p>
      )}
    </div>
  );
}
