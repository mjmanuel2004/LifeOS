import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import tachesRoutes from './routes/taches.js';
import depensesRoutes from './routes/depenses.js';
import revenusRoutes from './routes/revenus.js';
import budgetRoutes from './routes/budget.js';
import evenementsRoutes from './routes/evenements.js';
import templatesEvenementsRoutes from './routes/templates-evenements.js';
import recettesRoutes from './routes/recettes.js';
import planningSemaineRoutes from './routes/planning-semaine.js';
import listeCoursesRoutes from './routes/liste-courses.js';
import aiRoutes from './routes/ai.js';
import notificationsRoutes from './routes/notifications.js';
import calendarRoutes from './routes/calendar.js';
import accountsRoutes from './routes/accounts.js';
import transactionsRoutes from './routes/transactions.js';
import projetsRoutes from './routes/projets.js';
import authRoutes from './routes/auth.js';
import AppError from './utils/AppError.js';
import globalErrorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Définir proprement les chemins
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, 'client', 'dist');

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'http://localhost:4173', // Local preview
  process.env.FRONTEND_URL, // Production Azure Static Web App
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// 2. Servir les fichiers statiques (DOIT être avant les routes API pour éviter les conflits,
// mais surtout avant le catch-all)
app.use(express.static(buildPath));

// Routes API
app.use('/api/taches', tachesRoutes);
app.use('/api/depenses', depensesRoutes);
app.use('/api/revenus', revenusRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/evenements', evenementsRoutes);
app.use('/api/templates-evenements', templatesEvenementsRoutes);
app.use('/api/recettes', recettesRoutes);
app.use('/api/planning-semaine', planningSemaineRoutes);
app.use('/api/liste-courses', listeCoursesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/projets', projetsRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'LifeOS API' });
});

// Root route - Health Check (API only)
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'LifeOS API is running', env: process.env.NODE_ENV });
});

// 4. LE HANDLER REACT (CATCH-ALL)
// Important : Cette route doit être la DERNIÈRE avant le gestionnaire d'erreurs
app.get('*', (req, res, next) => {
  // Si la requête commence par /api, on ne sert pas l'index.html,
  // on laisse passer vers le gestionnaire 404
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 5. Gestion des routes API non trouvées (Uniquement pour le préfixe /api)
// Cette partie est en fait gérée par le globalErrorHandler si next() est appelé,
// mais on peut expliciter le 404 ici pour être sûr.
app.all('/api/*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// Connexion MongoDB (Non-blocking)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifeos';

mongoose
  .connect(MONGODB_URI, {
    // Options spécifiques pour Azure Cosmos DB si nécessaire
    // La plupart sont déjà dans l'URI, mais on peut forcer ici pour être sûr
    // ssl: true, // Déjà dans l'URI
    // retryWrites: false, // Déjà dans l'URI
  })
  .then(() => {
    console.info('MongoDB (Cosmos DB) connecté');
  })
  .catch((err) => {
    console.error('Erreur MongoDB:', err.message);
    console.info(
      "Mode sans DB: l'API répondra mais les données ne seront pas persistées. Configure MONGODB_URI (voir .env.example).",
    );
  });

// Start server immediately for Azure Health Checks
app.listen(PORT, () => {
  console.info(`API LifeOS sur http://localhost:${PORT}`);
});

