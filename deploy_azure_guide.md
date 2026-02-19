# Déploiement sur Azure Guide

Ce guide vous explique comment déployer l'API LifeOS sur Azure App Service avec Docker et Azure CLI.

## Prérequis

- Azure CLI installé (`az`).
- Docker installé et lancé.
- Une souscription Azure active.

## 1. Connexion et Création du Groupe de Ressources

```bash
# Se connecter à Azure
az login

# Créer un groupe de ressources (si pas déjà fait)
az group create --name RG-LifeOS --location westeurope
```

## 2. Créer une Azure Container Registry (ACR)

L'ACR va stocker votre image Docker privée.

```bash
# Choisissez un nom unique (ex: acrlifeosmonsan)
ACR_NAME=acrlifeosmonsan

# Créer le registre
az acr create --resource-group RG-LifeOS --name $ACR_NAME --sku Basic --admin-enabled true
```

## 3. Construire et Pousser l'Image Docker

```bash
# Se connecter au registre
az acr login --name $ACR_NAME

# Construire l'image (depuis la racine du projet, où se trouve le Dockerfile)
docker build -t $ACR_NAME.azurecr.io/lifeos:latest .

# Pousser l'image
docker push $ACR_NAME.azurecr.io/lifeos:latest
```

## 4. Créer l'App Service (Web App for Containers)

```bash
# Créer un plan App Service (Linux) - SKU B1 (Basic) ou F1 (Free) si disponible
az appservice plan create --name ASP-LifeOS --resource-group RG-LifeOS --sku B1 --is-linux

# Créer la Web App
az webapp create --resource-group RG-LifeOS --plan ASP-LifeOS --name lifeos-api-monsan --deployment-container-image-name $ACR_NAME.azurecr.io/lifeos:latest

# Configurer l'authentification ACR pour l'App Service
az webapp config container set --name lifeos-api-monsan --resource-group RG-LifeOS --docker-custom-image-name $ACR_NAME.azurecr.io/lifeos:latest --docker-registry-server-url https://$ACR_NAME.azurecr.io
```
Note: Si l'ACR Admin est activé, Azure gère souvent l'accès automatiquement via les credentials admin, sinon il faut configurer une identité managée.

## 5. Configurer les Variables d'Environnement

Configurez la connexion à Cosmos DB et les autres variables.

```bash
COSMOS_DB="mongodb://<username>:<password>@<host>:<port>/?ssl=true"
JWT_SECRET="votre_secret_tres_securise"

az webapp config appsettings set --resource-group RG-LifeOS --name lifeos-api-monsan --settings \
  MONGODB_URI="$COSMOS_DB" \
  JWT_SECRET="$JWT_SECRET" \
  NODE_ENV="production" \
  PORT="3000"
```

## 6. Vérification

Récupérez l'URL de votre API :
```bash
az webapp show --resource-group RG-LifeOS --name lifeos-api-monsan --query defaultHostName
```
Accédez à `https://<votre-app>.azurewebsites.net/api/health` pour vérifier que tout fonctionne.
