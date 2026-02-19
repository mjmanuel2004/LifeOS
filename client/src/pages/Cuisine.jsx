import { useState, useEffect } from 'react';
import { api } from '../api';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function getLundi(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - (day === 0 ? 6 : day - 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function Cuisine() {
  const [onglet, setOnglet] = useState('recettes'); // recettes | planning | courses
  const [recettes, setRecettes] = useState([]);
  const [planning, setPlanning] = useState(null);
  const [listeCourses, setListeCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formRecette, setFormRecette] = useState({
    titre: '',
    ingredients: [{ nom: '', quantite: '', unite: '' }],
    etapes: [''],
  });
  const [semaineDebut, setSemaineDebut] = useState(() => getLundi(new Date()));

  // Smart Kitchen State
  const [showSmartKitchen, setShowSmartKitchen] = useState(false);
  const [smartIngredients, setSmartIngredients] = useState('');
  const [generatedRecette, setGeneratedRecette] = useState(null);
  const [generating, setGenerating] = useState(false);

  const loadRecettes = () => api.getRecettes().then(setRecettes);
  const loadPlanning = () => api.getPlanningSemaine(semaineDebut.toISOString()).then(setPlanning);
  const loadListe = () =>
    api.getListeCourses().then((l) => setListeCourses(l?.items?.length ? l : null));

  useEffect(() => {
    setLoading(true);
    Promise.all([loadRecettes(), loadPlanning(), loadListe()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [semaineDebut]);

  const refreshPlanning = () => loadPlanning().catch((e) => setError(e.message));
  const refreshListe = () => loadListe().catch((e) => setError(e.message));

  const getSlotForJour = (jourIndex) => {
    const slot = planning?.slots?.find((s) => s.jour === jourIndex);
    return slot?.recetteId;
  };

  const setSlotForJour = (jourIndex, recetteId) => {
    const slots = [...(planning?.slots || [])];
    const idx = slots.findIndex((s) => s.jour === jourIndex);
    if (recetteId) {
      if (idx >= 0) slots[idx] = { jour: jourIndex, recetteId };
      else slots.push({ jour: jourIndex, recetteId });
    } else if (idx >= 0) slots.splice(idx, 1);
    const dateDebut = planning?.dateDebut || semaineDebut;
    api
      .updatePlanningSemaine(dateDebut, slots)
      .then(() => refreshPlanning())
      .catch((e) => setError(e.message));
  };

  const handleGenererListe = () => {
    api
      .genererListeCourses(semaineDebut.toISOString())
      .then(() => refreshListe())
      .catch((e) => setError(e.message));
  };

  const handleSmartGenerate = async () => {
    if (!smartIngredients.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const ingredientsList = smartIngredients.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.generateRecette(ingredientsList);
      setGeneratedRecette(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const saveGeneratedRecette = () => {
    if (!generatedRecette) return;
    api
      .createRecette(generatedRecette)
      .then(() => {
        loadRecettes();
        setShowSmartKitchen(false);
        setGeneratedRecette(null);
        setSmartIngredients('');
      })
      .catch((e) => setError(e.message));
  };

  const recettePourId = (id) => recettes.find((r) => r._id === id);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Cuisine & Courses</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {['recettes', 'planning', 'courses'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOnglet(t)}
            className={`px-4 py-2 rounded-t-xl text-sm font-medium ${onglet === t ? 'bg-black/8 text-gray-900' : 'text-gray-500 hover:bg-black/4'
              }`}
          >
            {t === 'recettes'
              ? 'Recettes'
              : t === 'planning'
                ? 'Planning semaine'
                : 'Liste de courses'}
          </button>
        ))}
      </div>

      {loading && onglet !== 'recettes' ? <p className="text-gray-500">Chargement…</p> : null}

      {/* Onglet Recettes */}
      {onglet === 'recettes' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowSmartKitchen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <span>🪄</span> Frigo Intelligent
            </button>
          </div>

          <div className="glass rounded-2xl p-4 mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Nouvelle recette</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const ingredients = [];
                for (let i = 0; i < 20; i++) {
                  const nom = fd.get(`ing_nom_${i}`);
                  if (!nom?.toString().trim()) continue;
                  ingredients.push({
                    nom: nom.toString().trim(),
                    quantite: (fd.get(`ing_qty_${i}`) || '1').toString(),
                    unite: (fd.get(`ing_unit_${i}`) || '').toString(),
                  });
                }
                const etapes = (fd.get('etapes') || '').split('\n').filter(Boolean);
                api
                  .createRecette({
                    titre: fd.get('titre'),
                    ingredients,
                    etapes,
                    dureeMinutes: parseInt(fd.get('dureeMinutes'), 10) || null,
                  })
                  .then(() => {
                    loadRecettes();
                    e.target.reset();
                  })
                  .catch((e) => setError(e.message));
              }}
              className="space-y-3"
            >
              <input
                name="titre"
                placeholder="Titre de la recette"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Ingrédients (nom, quantité, unité) — jusqu’à 5 lignes
                </p>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <input
                      name={`ing_nom_${i}`}
                      placeholder="Nom"
                      className="flex-1 px-2 py-1.5 rounded border text-sm"
                    />
                    <input
                      name={`ing_qty_${i}`}
                      placeholder="Qté"
                      className="w-16 px-2 py-1.5 rounded border text-sm"
                    />
                    <input
                      name={`ing_unit_${i}`}
                      placeholder="Unité"
                      className="w-20 px-2 py-1.5 rounded border text-sm"
                    />
                  </div>
                ))}
              </div>
              <textarea
                name="etapes"
                placeholder="Étapes (une par ligne)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                name="dureeMinutes"
                type="number"
                placeholder="Durée (min)"
                className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium"
              >
                Créer la recette
              </button>
            </form>
          </div>
          <ul className="space-y-2">
            {recettes.map((r) => (
              <li key={r._id} className="glass rounded-2xl p-4 flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{r.titre}</p>
                  <p className="text-xs text-gray-500">
                    {r.ingredients?.length || 0} ingrédients · {r.etapes?.length || 0} étapes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => api.deleteRecette(r._id).then(loadRecettes)}
                  className="text-red-600 text-sm"
                >
                  Suppr.
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Onglet Planning semaine */}
      {onglet === 'planning' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() =>
                setSemaineDebut((d) => {
                  const n = new Date(d);
                  n.setDate(n.getDate() - 7);
                  return n;
                })
              }
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm"
            >
              ← Semaine préc.
            </button>
            <span className="text-sm text-gray-600">
              Semaine du{' '}
              {semaineDebut.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <button
              type="button"
              onClick={() =>
                setSemaineDebut((d) => {
                  const n = new Date(d);
                  n.setDate(n.getDate() + 7);
                  return n;
                })
              }
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm"
            >
              Semaine suiv. →
            </button>
          </div>
          <div className="glass rounded-2xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Glissez une recette sur un jour (ou choisissez dans la liste).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {JOURS.map((nom, jourIndex) => (
                <div key={jourIndex} className="border border-gray-200 rounded-xl p-3 min-h-[80px]">
                  <p className="text-xs font-medium text-gray-500 mb-2">{nom}</p>
                  <select
                    value={getSlotForJour(jourIndex) || ''}
                    onChange={(e) => setSlotForJour(jourIndex, e.target.value || null)}
                    className="w-full text-sm rounded-lg border border-gray-200 py-2"
                  >
                    <option value="">—</option>
                    {recettes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.titre}
                      </option>
                    ))}
                  </select>
                  {getSlotForJour(jourIndex) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {recettePourId(getSlotForJour(jourIndex))?.titre}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenererListe}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium"
          >
            Générer la liste de courses à partir de cette semaine
          </button>
        </>
      )}

      {/* Onglet Liste de courses */}
      {onglet === 'courses' && (
        <>
          <div className="glass rounded-2xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-2">
              Liste générée à partir du planning de la semaine. Vous pouvez ajouter des prix pour le
              simulateur Budget.
            </p>
            {!listeCourses?.items?.length ? (
              <p className="text-gray-500 text-sm">
                Aucune liste. Générez-la depuis l’onglet &quot;Planning semaine&quot;.
              </p>
            ) : (
              <ul className="space-y-2">
                {(listeCourses.items || []).map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!item.coche} readOnly className="rounded" />
                    <span className={item.coche ? 'line-through text-gray-500' : 'text-gray-900'}>
                      {item.nom} {item.quantite} {item.unite}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Prix"
                      defaultValue={item.prix}
                      className="w-16 px-2 py-1 rounded border text-sm"
                      onBlur={(e) => {
                        const prix = parseFloat(e.target.value);
                        if (!isNaN(prix)) {
                          const items = [...(listeCourses.items || [])];
                          if (items[i]) items[i] = { ...items[i], prix };
                          api.updateListeCourses(listeCourses._id, { items }).then(refreshListe);
                        }
                      }}
                    />
                    €
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Smart Kitchen Modal */}
      {showSmartKitchen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🪄</span> Frigo Intelligent
              </h3>
              <button
                onClick={() => setShowSmartKitchen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {!generatedRecette ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quels ingrédients avez-vous ?
                    </label>
                    <textarea
                      value={smartIngredients}
                      onChange={(e) => setSmartIngredients(e.target.value)}
                      placeholder="Ex: 3 oeufs, un peu de lait, de la farine, des épinards..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Séparez les ingrédients par des virgules ou écrivez une phrase.
                    </p>
                  </div>

                  <button
                    onClick={handleSmartGenerate}
                    disabled={generating || !smartIngredients.trim()}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Invention en cours...
                      </>
                    ) : (
                      'Générer une recette'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-lg text-indigo-900 mb-2">{generatedRecette.titre}</h4>
                    <div className="flex items-center gap-4 text-sm text-indigo-700 mb-4">
                      <span>⏱️ {generatedRecette.dureeMinutes} min</span>
                      <span>🥘 {generatedRecette.ingredients.length} ingrédients</span>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-indigo-900 text-sm mb-2">Ingrédients</h5>
                      <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
                        {generatedRecette.ingredients.map((ing, i) => (
                          <li key={i}>{ing.quantite} {ing.unite} {ing.nom}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-indigo-900 text-sm mb-2">Instructions</h5>
                      <ol className="list-decimal list-inside text-sm text-indigo-800 space-y-2">
                        {generatedRecette.etapes.map((etape, i) => (
                          <li key={i} className="pl-2">{etape}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setGeneratedRecette(null)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                    >
                      Essayer autre chose
                    </button>
                    <button
                      onClick={saveGeneratedRecette}
                      className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
                    >
                      Sauvegarder la recette
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
