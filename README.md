# LifeOS

Application multi-dispositifs (Mac & iPhone) : Dashboard, Budget, Planning, Recettes.  
Frontend React + Tailwind, backend Node.js/Express, base MongoDB.

## Prérequis

- Node.js 18+
- MongoDB (local ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## MongoDB Atlas (recommandé pour sync Mac/iPhone)

1. Crée un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crée un cluster gratuit (M0).
3. **Database Access** → Add New Database User (nom + mot de passe).
4. **Network Access** → Add IP Address → "Allow Access from Anywhere" (`0.0.0.0/0`) pour tester depuis iPhone.
5. **Database** → Connect → "Connect your application" → copie l’URI (ex. `mongodb+srv://user:pass@cluster.mongodb.net/`).
6. À la racine du projet, copie `.env.example` en `.env` et renseigne :

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/lifeos?retryWrites=true&w=majority
PORT=3001
```

(Remplace `USER`, `PASSWORD` et `CLUSTER` par tes valeurs.)

## Installation

```bash
# Racine du projet
npm install

# Frontend
cd client && npm install && cd ..
```

## Lancement

**Terminal 1 – API (port 3001)**  
À la racine du projet :

```bash
npm run dev
```

**Terminal 2 – Frontend (port 5173)**  
Dans le dossier `client` :

```bash
cd client && npm run dev
```

- Sur **Mac** : ouvre [http://localhost:5173](http://localhost:5173).
- Sur **iPhone** (même Wi‑Fi que le Mac) :
  - Récupère l’IP du Mac (`ifconfig | grep "inet "` ou Préférences Système → Réseau).
  - Sur l’iPhone, ouvre `http://<IP_DU_MAC>:5173` (ex. `http://192.168.1.10:5173`).

Vite proxy fait que les appels `/api` depuis le front sont envoyés au backend sur le Mac ; les données viennent donc de la même API (et de MongoDB), identiques sur Mac et iPhone.  
Après avoir ajouté une tâche ou une dépense sur un appareil, rafraîchis l’autre pour voir la donnée (sync par rafraîchissement).

## Structure

```
LifeOS/
├── server.js           # API Express
├── models/
│   ├── Tache.js        # Modèle Tâche (Planning)
│   └── Depense.js      # Modèle Dépense (Budget)
├── routes/
│   ├── taches.js       # CRUD tâches
│   └── depenses.js     # CRUD dépenses
├── client/             # Frontend React + Tailwind
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js      # Appels API
│   │   ├── components/
│   │   │   └── Layout.jsx  # Menu responsive (sidebar desktop / barre bas mobile)
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Budget.jsx
│   │       ├── Planning.jsx
│   │       └── Recettes.jsx
│   └── vite.config.js  # Proxy /api → backend
└── .env.example
```

## Modèles de données

- **Tâche** : `titre`, `description`, `terminee`, `dateEcheance`, `createdAt`
- **Dépense** : `libelle`, `montant`, `categorie`, `date`, `createdAt`

## Test rapide (sans MongoDB)

Sans fichier `.env` ni MongoDB local, le serveur démarre mais les routes `/api/taches` et `/api/depenses` échoueront. Pour tester l’UI uniquement, tu peux lancer le frontend ; pour tester l’ajout de données et la sync, configure MongoDB (Atlas ou local).
