const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  // Ensure we send cookies/tokens with every request
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  };

  const res = await fetch(`${API_BASE}${path}`, finalOptions);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

function qs(params) {
  const s = new URLSearchParams(params).toString();
  return s ? `?${s}` : '';
}

export const api = {
  // AI & Intelligence
  getChatResponse: (message) => request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getFinancialAdvice: (data) => request('/api/ai/analyze', { method: 'POST', body: JSON.stringify(data) }),
  getAIContext: (prompt) => request('/api/ai/context', { method: 'POST', body: JSON.stringify({ prompt }) }),

  // Tâches
  getTaches: () => request('/api/taches'),
  createTache: (body) => request('/api/taches', { method: 'POST', body: JSON.stringify(body) }),
  updateTache: (id, body) =>
    request(`/api/taches/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTache: (id) => request(`/api/taches/${id}`, { method: 'DELETE' }),

  // Dépenses & Budget
  getDepenses: (mois, annee) => request('/api/depenses' + qs({ mois, annee })),
  createDepense: (body) => request('/api/depenses', { method: 'POST', body: JSON.stringify(api._attachUser(body)) }),
  deleteDepense: (id) => request(`/api/depenses/${id}`, { method: 'DELETE' }),
  getRevenus: (mois, annee) => request('/api/revenus' + qs({ mois, annee })),
  createRevenu: (body) => request('/api/revenus', { method: 'POST', body: JSON.stringify(body) }),
  deleteRevenu: (id) => request(`/api/revenus/${id}`, { method: 'DELETE' }),
  getBudgetMensuel: (mois, annee) => request('/api/budget/mensuel' + qs({ mois, annee })),

  scanTicket: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE}/api/depenses/scan`, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
  },

  // Budget & Accounts
  getAccounts: () => request('/api/accounts'),
  createAccount: (data) => request('/api/accounts', { method: 'POST', body: JSON.stringify(data) }),
  syncAccounts: () => request('/api/accounts/sync', { method: 'POST' }), // For demo reset
  getTransactions: () => request('/api/transactions'),
  createTransaction: (data) => request('/api/transactions', { method: 'POST', body: JSON.stringify(data) }),

  // Simulations (can use local logic or specific endpoint if needed)

  // Helper to attach user ID
  _attachUser: (data) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { ...data, user: user._id || user.id };
  },

  // Cuisine & Recipes
  getRecettes: () => request('/api/recettes'),
  getRecette: (id) => request(`/api/recettes/${id}`),
  createRecette: (data) => request('/api/recettes', { method: 'POST', body: JSON.stringify(api._attachUser(data)) }),
  seedRecettes: () => request('/api/recettes/seed', { method: 'POST' }), // Demo Seed

  // Sport & Workouts
  getSeances: () => request('/api/seances-sport'),
  createSeance: (data) => request('/api/seances-sport', { method: 'POST', body: JSON.stringify(api._attachUser(data)) }),
  seedSeances: () => request('/api/seances-sport/seed', { method: 'POST' }),

  // Projects
  getProjets: () => request('/api/projets'),
  createProjet: (data) => request('/api/projets', { method: 'POST', body: JSON.stringify(data) }), // Projects might be shared or personal? Leaving as is for now unless specified.
  seedProjets: () => request('/api/projets/seed', { method: 'POST' }),

  // Notifications
  getNotifications: () => request('/api/notifications'),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  clearNotifications: () => request('/api/notifications/clear', { method: 'POST' }),

  // Calendar & Events
  getCalendarItems: (start, end) => request(`/api/calendar?start=${start}&end=${end}`),
  createEvent: (data) => request('/api/evenements', { method: 'POST', body: JSON.stringify(data) }),
  seedEvents: () => request('/api/evenements/seed', { method: 'POST' }),
  createTask: (body) => request('/api/calendar/task', { method: 'POST', body: JSON.stringify(body) }),

  // Événements (Planning étudiant)
  getEvenements: (debut, fin) => request('/api/evenements' + qs({ debut, fin })),
  getProchainCours: () => request('/api/evenements/prochain'),
  importIcs: (ics) =>
    request('/api/evenements/import-ics', { method: 'POST', body: JSON.stringify({ ics }) }),
  createEvenement: (body) =>
    request('/api/evenements', { method: 'POST', body: JSON.stringify(body) }),
  deleteEvenement: (id) => request(`/api/evenements/${id}`, { method: 'DELETE' }),

  // Templates d'événements
  getTemplatesEvenements: () => request('/api/templates-evenements'),
  createTemplateEvenement: (body) =>
    request('/api/templates-evenements', { method: 'POST', body: JSON.stringify(body) }),
  creerEvenementDepuisTemplate: (templateId, date) =>
    request(`/api/templates-evenements/${templateId}/creer-evenement`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),
  deleteTemplateEvenement: (id) => request(`/api/templates-evenements/${id}`, { method: 'DELETE' }),

  // Recettes & Cuisine
  getRecettes: () => request('/api/recettes'),
  getRecette: (id) => request(`/api/recettes/${id}`),
  createRecette: (body) => request('/api/recettes', { method: 'POST', body: JSON.stringify(body) }),
  updateRecette: (id, body) =>
    request(`/api/recettes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteRecette: (id) => request(`/api/recettes/${id}`, { method: 'DELETE' }),
  generateRecette: (ingredients) =>
    request('/api/recettes/generate', { method: 'POST', body: JSON.stringify({ ingredients }) }),

  // Planning semaine (repas)
  getPlanningSemaine: (date) => request('/api/planning-semaine' + qs({ date })),
  updatePlanningSemaine: (dateDebut, slots) =>
    request('/api/planning-semaine', { method: 'PUT', body: JSON.stringify({ dateDebut, slots }) }),

  // Liste de courses
  getListeCourses: () => request('/api/liste-courses'),
  genererListeCourses: (dateDebut) =>
    request('/api/liste-courses/generer', { method: 'POST', body: JSON.stringify({ dateDebut }) }),
  updateListeCourses: (id, body) =>
    request(id ? `/api/liste-courses/${id}` : '/api/liste-courses', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
};
