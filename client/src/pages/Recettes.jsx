import { useState } from 'react';

export default function Recettes() {
  const [recettes] = useState([
    { id: 1, nom: 'Pâtes carbonara', duree: '20 min' },
    { id: 2, nom: 'Salade César', duree: '15 min' },
    { id: 3, nom: 'Omelette', duree: '10 min' },
  ]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Recettes</h1>
      <p className="text-sm text-gray-500 mb-4">
        Liste de base. Les recettes pourront être synchronisées via l&apos;API plus tard.
      </p>
      <ul className="space-y-2">
        {recettes.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3"
          >
            <span className="font-medium text-gray-800">{r.nom}</span>
            <span className="text-sm text-gray-500">{r.duree}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
