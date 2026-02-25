#!/bin/bash
# Script pour mettre à jour l'application LifeOS sur Azure

echo "🚀 Début de la mise à jour pour Azure..."

# 1. Reconstruire le frontend (Dossier 'client')
echo "📦 1. Construction de l'interface utilisateur (Frontend)..."
npm run build:full

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build frontend. Annulation du déploiement."
    exit 1
fi

# 2. Créer l'archive Zip pour le déploiement Azure
echo "🗜️  2. Compression du projet en cours (server.zip)..."
# On exclut les dossiers lourds ou inutiles (node_modules, .git, etc.)
zip -r server.zip . -x "node_modules/*" -x "client/node_modules/*" -x ".git/*" -x ".idea/*" -x "*.zip" -x "logs_*"

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la compression ZIP."
    exit 1
fi

# 3. Déployer sur Azure avec AZ CLI
echo "☁️  3. Déploiement vers Azure App Service..."
az webapp deployment source config-zip --name lifeos-api-monsan --resource-group LifeOS_Group --src server.zip

if [ $? -eq 0 ]; then
    echo "✅ Déploiement terminé avec succès ! Votre code est à jour sur Azure."
    echo "🌍 Accédez à : https://lifeos-api-monsan.azurewebsites.net"
else
    echo "❌ Échec du déploiement sur Azure."
fi
