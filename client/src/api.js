// Utilise l'URL relative car le frontend est servi par le backend
const API_BASE = '';

async function request(path, options = {}) {
  const token = localStorage.getItem('token'); // Récupère le JWT stocké au Login

  const defaultOptions = {
    // Crucial pour que le CORS d'Azure accepte les requêtes avec Token
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // Ajoute le token dans le header Authorization si présent
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  };

  const res = await fetch(`${API_BASE}${path}`, finalOptions);

  if (!res.ok) {
    console.error(`API Error on ${path}: `, res.status, res.statusText);
    const err = await res.json().catch(() => ({ error: res.statusText }));
    console.error(`API Error Body: `, err);
    throw new Error(err.error || err.message || res.statusText);
  }
  return res.json();
}

function qs(params) {
  const s = new URLSearchParams(params).toString();
  return s ? `?${s}` : '';
}

export const api = {
  // Auth
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => request(`/api/auth/reset-password/${token}`, { method: 'PUT', body: JSON.stringify({ password }) }),
  verify2FALogin: (tempToken, code) => request('/api/auth/login/verify', { method: 'POST', body: JSON.stringify({ tempToken, code }) }),
  generate2FA: () => request('/api/auth/2fa/generate', { method: 'POST' }),
  enable2FA: (token) => request('/api/auth/2fa/enable', { method: 'POST', body: JSON.stringify({ token }) }),
  googleLogin: (accessToken) => request('/api/auth/google', { method: 'POST', body: JSON.stringify({ accessToken }) }),
  githubLogin: (code) => request('/api/auth/github', { method: 'POST', body: JSON.stringify({ code }) }),
  appleLogin: (identityToken, user) => request('/api/auth/apple', { method: 'POST', body: JSON.stringify({ identityToken, user }) }),

  // Helper to attach user ID
  _attachUser: (data) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Utilise l'ID de l'utilisateur connecté pour filtrer dans MongoDB
    return { ...data, userId: user._id || user.id };
  },

  // AI & Intelligence
  getChatResponse: (message) => request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getFinancialAdvice: (data) => request('/api/ai/analyze', { method: 'POST', body: JSON.stringify(data) }),
  getAIContext: (prompt) => request('/api/ai/context', { method: 'POST', body: JSON.stringify({ prompt }) }),

  // Tâches
  getTaches: () => request('/api/taches'),
  createTache: (body) => request('/api/taches', { method: 'POST', body: JSON.stringify(api._attachUser(body)) }),
  updateTache: (id, body) =>
    request(`/api/taches/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTache: (id) => request(`/api/taches/${id}`, { method: 'DELETE' }),

  // Dépenses & Budget
  getDepenses: (mois, annee) => request('/api/depenses' + qs({ mois, annee })),
  createDepense: (body) => request('/api/depenses', { method: 'POST', body: JSON.stringify(api._attachUser(body)) }),
  deleteDepense: (id) => request(`/api/depenses/${id}`, { method: 'DELETE' }),
  getRevenus: (mois, annee) => request('/api/revenus' + qs({ mois, annee })),
  createRevenu: (body) => request('/api/revenus', { method: 'POST', body: JSON.stringify(api._attachUser(body)) }),
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
  createAccount: (data) => request('/api/accounts', { method: 'POST', body: JSON.stringify(api._attachUser(data)) }),
  syncAccounts: () => request('/api/accounts/sync', { method: 'POST' }), // For demo reset
  getTransactions: () => request('/api/transactions'),
  createTransaction: (data) => request('/api/transactions', { method: 'POST', body: JSON.stringify(api._attachUser(data)) }),

  // Simulations (can use local logic or specific endpoint if needed)

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
  createProjet: (data) => request('/api/projets', { method: 'POST', body: JSON.stringify(api._attachUser(data)) }), // Projects might be shared or personal? Leaving as is for now unless specified.
  seedProjets: () => request('/api/projets/seed', { method: 'POST' }),

  // Notifications
  getNotifications: () => request('/api/notifications'),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  clearNotifications: () => request('/api/notifications/clear', { method: 'POST' }),

  // Calendar & Events
  getCalendarItems: (start, end) => request(`/api/calendar?start=${start}&end=${end}`),
  createEvent: (data) => request('/api/evenements', { method: 'POST', body: JSON.stringify(api._attachUser(data)) }),
  seedEvents: () => request('/api/evenements/seed', { method: 'POST' }),
  createTask: (body) => request('/api/calendar/task', { method: 'POST', body: JSON.stringify(api._attachUser(body)) }),

  // Événements (Planning étudiant)
  getEvenements: (debut, fin) => request('/api/evenements' + qs({ debut, fin })),
  getProchainCours: () => request('/api/evenements/prochain'),
  importIcs: (ics) =>
    request('/api/evenements/import-ics', { method: 'POST', body: JSON.stringify({ ics }) }),
  createEvenement: (body) =>
    request('/api/evenements', { method: 'POST', body: JSON.stringify(api._attachUser(body)) }),
  deleteEvenement: (id) => request(`/api/evenements/${id}`, { method: 'DELETE' }),

  // Templates d'événements
  getTemplatesEvenements: () => request('/api/templates-evenements'),
  createTemplateEvenement: (body) =>
    request('/api/templates-evenements', { method: 'POST', body: JSON.stringify(api._attachUser(body)) }),
  creerEvenementDepuisTemplate: (templateId, date) =>
    request(`/api/templates-evenements/${templateId}/creer-evenement`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),
  deleteTemplateEvenement: (id) => request(`/api/templates-evenements/${id}`, { method: 'DELETE' }),

  // Recettes & Cuisine
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
