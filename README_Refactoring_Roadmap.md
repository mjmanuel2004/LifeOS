# Roadmap de Refactoring & Améliorations LifeOS

Ce document retrace les améliorations techniques apportées au projet **LifeOS** et liste les prochaines étapes.

## ✅ Phase 1 : Architecture Backend (Complétée)

**Objectif :** Séparer la logique métier des définitions de routes et améliorer la gestion des erreurs.

### Changements effectués :
1.  **Structure de Dossiers** :
    *   `controllers/` : Contient la logique métier (CRUD, calculs).
    *   `middlewares/` : Contient les middlewares Express (ex: Error Handler).
    *   `utils/` : Classes et fonctions utilitaires (`AppError`, `catchAsync`, `dateUtils`).

2.  **Gestion des Erreurs** :
    *   **Global Error Handler** : Un middleware centralisé dans `middlewares/errorHandler.js` intercepte toutes les erreurs.
    *   **AppError** : Une classe personnalisée pour uniformiser les erreurs opérationnelles (404, 400, etc.).
    *   **catchAsync** : Un wrapper pour supprimer les blocs `try/catch` répétitifs dans les contrôleurs async.

3.  **Migration des Routes** :
    *   Toutes les routes (`taches`, `depenses`, `revenus`, `budget`, `evenements`, `templates`, `recettes`, `planning`, `courses`) délèguent désormais le traitement à des contrôleurs dédiés.

## ✅ Phase 2 : Sécurité & Stabilité (Complétée)

**Objectif :** Renforcer la robustesse de l'API.

- [x] **Validation des Données** :
    - Installation de `zod`.
    - Création du middleware `middlewares/validate.js`.
    - Définition des schémas de validation dans `validations/*.js`.
    - Application de la validation sur toutes les routes POST/PUT/PATCH.
- [ ] **Sécurité HTTP** : Ajouter `helmet` pour sécuriser les en-têtes HTTP.
- [ ] **Rate Limiting** : Ajouter `express-rate-limit` pour prévenir les abus.

## ✅ Phase 3 : Qualité du Code (Complétée)

**Objectif :** Garantiir un style de code cohérent.

- [x] **Linting & Formatage** :
    - Installation de `eslint`, `prettier` et `globals`.
    - Configuration moderne (`eslint.config.js`).
    - Scripts NPM : `npm run lint`, `npm run lint:fix`, `npm run format`.
    - Nettoyage du code existant (suppression des variables inutilisées, formatage).
- [ ] **Path Aliases** : Configurer `@/` pour éviter les imports relatifs longs (`../../../`).
- [ ] **Husky** : Hooks git pour vérifier le code avant le commit.

## 🔜 Phase 4 : Tests

- [ ] **Tests Unitaires** : Tester les contrôleurs et les utilitaires (Jest/Vitest).
- [ ] **Tests d'Intégration** : Tester les endpoints API avec une base de données de test (Supertest).
