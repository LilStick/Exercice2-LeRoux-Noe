# TodoList API

API REST simple pour gérer une liste de tâches avec Node.js, Express et MongoDB.

## Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd nodeToDo

# Installer les dépendances
npm install

# Lancer MongoDB
brew services start mongodb-community
```

## Configuration

Créer un fichier `.env` à la racine :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todolist
```

## Démarrage

```bash
# Mode production
npm start

# Mode développement (auto-reload)
npm run dev
```

L'application est accessible sur `http://localhost:3000`

## Interface Web

Accédez à l'interface visuelle de la todolist directement dans votre navigateur :

**http://localhost:3000**

L'interface permet de :
- Voir toutes les tâches
- Ajouter une nouvelle tâche
- Supprimer une tâche

## API REST

L'API JSON est disponible sur les endpoints suivants :

| Méthode | Endpoint           | Description              |
|---------|-------------------|--------------------------|
| GET     | `/tasks`          | Récupérer toutes les tâches |
| POST    | `/tasks`          | Créer une tâche          |
| DELETE  | `/tasks/:id`      | Supprimer une tâche      |

### Exemples

**Créer une tâche :**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Faire les courses"}'
```

**Voir toutes les tâches :**
```bash
curl http://localhost:3000/tasks
```

**Supprimer une tâche :**
```bash
curl -X DELETE http://localhost:3000/tasks/67xxxxx
```

## Tests

```bash
# Lancer les tests
npm test

# Mode watch
npm run test:watch
```

## Qualité du code

```bash
# Vérifier le code (ESLint)
npm run lint

# Formater le code (Prettier)
npm run format
```

## Docker

```bash
# Lancer avec Docker Compose
docker-compose up --build

# Arrêter les conteneurs
docker-compose down
```

## Structure

```
nodeToDo/
├── src/
│   ├── models/          # Modèles Mongoose
│   ├── controllers/     # Logique métier
│   ├── routes/          # Routes Express
│   ├── views/           # Templates Pug
│   ├── config/          # Configuration DB
│   ├── app.js           # Configuration Express
│   └── server.js        # Point d'entrée
├── __tests__/           # Tests unitaires
├── .env                 # Variables d'environnement
└── package.json
```

## Technologies

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **Pug** - Moteur de templates
- **Jest** - Framework de tests
- **ESLint** - Linter
- **Prettier** - Formateur de code
- **Docker** - Conteneurisation