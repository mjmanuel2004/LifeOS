import React from 'react';

export default function Admin() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-500">Documents et gestion du logement</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Documents Importants</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Document Card Placeholder */}
            <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group">
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                Assurance Habitation
              </h3>
              <p className="text-xs text-gray-500 mt-1">Expire le 12/12/2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
