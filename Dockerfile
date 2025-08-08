# Image Node officielle
FROM node:20

# Répertoire de travail dans le container
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .

# Variables d'environnement (valeurs par défaut)
ENV NODE_ENV=production

# Commande pour lancer le bot
CMD ["node", "index.js"]
