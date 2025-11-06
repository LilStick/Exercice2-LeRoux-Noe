# TodoList API

Node.js REST API for managing a task list with Express, MongoDB, PostgreSQL, and Swagger documentation.

## Features

- Dual database support (MongoDB + PostgreSQL)
- RESTful API endpoints
- Interactive Swagger UI documentation
- Comprehensive test suite (27 tests)
- 77% code coverage
- Web interface for task management

## Installation

```bash
# Clone the project
git clone <repo-url>
cd nodeToDo

# Install dependencies
npm install

# Start MongoDB
brew services start mongodb-community

# Start PostgreSQL
brew services start postgresql
```

## Configuration

Create a `.env` file at the root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todolist
PG_USER=your_user
PG_PASSWORD=your_password
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=todolist
DATABASE_MODE=both
```

### Database Modes

The project supports three operation modes via `DATABASE_MODE`:

- **`both`** (default): Synchronizes data between MongoDB and PostgreSQL
- **`mongodb`**: Uses MongoDB only
- **`postgresql`**: Uses PostgreSQL only

### Create PostgreSQL Database

```bash
# Create database (replace USER with your username)
createdb -U USER todolist
```

The `tasks_pg` table will be created automatically on startup.

## Getting Started

```bash
# Production mode
npm start

# Development mode (auto-reload)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

Application runs on `http://localhost:3000`

## Swagger Documentation

Access interactive API documentation at:

**http://localhost:3000/api-docs**

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive testing interface
- OpenAPI 3.0 specification

Swagger JSON specification available at:
**http://localhost:3000/api-docs.json**

## API Endpoints

### MongoDB Tasks

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
  - Body: `{ "title": "Task title" }`
- `DELETE /tasks/:id` - Delete a task by MongoDB ID

### PostgreSQL Tasks

- `GET /tasks-pg` - Get all tasks
- `POST /tasks-pg` - Create a new task
  - Body: `{ "title": "Task title" }`
- `DELETE /tasks-pg/:id` - Delete a task by PostgreSQL ID

### Web Interface

- `GET /` - Display task management interface
- `POST /tasks/add` - Add task to both databases (form)
- `POST /tasks/delete/:id` - Delete task from both databases (form)

## Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- 27 tests total
- 77.43% code coverage
- Tests include:
  - Swagger documentation (10 tests)
  - MongoDB operations (6 tests)
  - PostgreSQL operations (6 tests)
  - View controller (5 tests)

## Project Structure

```
nodeToDo/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   ├── postgres.js        # PostgreSQL connection
│   │   └── swagger.js         # Swagger configuration
│   ├── controllers/
│   │   ├── taskController.js     # MongoDB task controller
│   │   ├── taskPgController.js   # PostgreSQL task controller
│   │   └── viewController.js     # Web interface controller
│   ├── models/
│   │   └── Task.js            # MongoDB Task model
│   ├── routes/
│   │   ├── taskRoutes.js      # MongoDB task routes
│   │   ├── taskPgRoutes.js    # PostgreSQL task routes
│   │   └── viewRoutes.js      # Web interface routes
│   └── views/
│       └── index.pug          # Web interface template
├── __tests__/
│   ├── task.test.js           # MongoDB tests
│   ├── taskPg.test.js         # PostgreSQL tests
│   ├── view.test.js           # View controller tests
│   └── swagger.test.js        # Swagger documentation tests
├── .env                       # Environment variables
├── package.json
└── README.md
```

## Technologies

- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **PostgreSQL** - SQL database
- **pg** - PostgreSQL client
- **Swagger UI Express** - API documentation
- **Swagger JSDoc** - OpenAPI specification generator
- **Pug** - Template engine
- **Jest** - Testing framework
- **Supertest** - HTTP testing

## Database Schema

### MongoDB Task Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### PostgreSQL tasks_pg Table
```sql
CREATE TABLE tasks_pg (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Key Changes and Improvements

### 1. Swagger Documentation Implementation
- Added `swagger-jsdoc` and `swagger-ui-express` packages
- Created comprehensive API documentation with OpenAPI 3.0 specification
- Documented all endpoints with request/response schemas
- Added interactive Swagger UI at `/api-docs`
- Created 10 dedicated tests for Swagger functionality

### 2. Code Quality Improvements
- Removed all emojis from codebase
- Removed unnecessary comments
- Translated all user-facing text to English
- Improved error handling in database connections
- Added timeout configuration for MongoDB connections

### 3. Testing Enhancements
- Created dedicated test file for Swagger (`swagger.test.js`)
- Improved test isolation with proper setup/teardown hooks
- Added `--runInBand` flag to run tests sequentially
- Added `--forceExit` flag to prevent hanging processes
- Achieved 77.43% code coverage

### 4. Server Resilience
- Modified server startup to continue even if databases are unavailable
- Changed from `Promise.all()` to `Promise.allSettled()`
- Added informative warnings when databases fail to connect
- Improved error messages for better debugging

### 5. Configuration Files
- Updated `jest.config.js` for better test execution
- Modified `package.json` test scripts
- Created `swagger.js` configuration file
- Improved database connection handling

## License

ISC

## Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd nodeToDo

# Installer les dépendances
npm install

# Lancer MongoDB
brew services start mongodb-community

# Lancer PostgreSQL (si ce n'est pas déjà fait)
brew services start postgresql
```

## Configuration

Créer un fichier `.env` à la racine :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todolist
PG_USER=votre_user
PG_PASSWORD=votre_password
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=todolist
DATABASE_MODE=both
```

### Mode de base de données

Le projet supporte trois modes de fonctionnement via la variable `DATABASE_MODE` :

- **`both`** (par défaut) : Synchronise les données entre MongoDB et PostgreSQL
- **`mongodb`** : Utilise uniquement MongoDB
- **`postgresql`** : Utilise uniquement PostgreSQL

**Exemple :**
```bash
# Mode MongoDB uniquement
DATABASE_MODE=mongodb npm start

# Mode PostgreSQL uniquement
DATABASE_MODE=postgresql npm start

# Mode synchronisé (par défaut)
DATABASE_MODE=both npm start
```

### Créer la base PostgreSQL

```bash
# Créer la base de données (remplacer USER par votre utilisateur)
createdb -U USER todolist
```

La table `tasks_pg` sera créée automatiquement au démarrage.

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
- Ajouter une nouvelle tâche (synchronisée automatiquement dans MongoDB ET PostgreSQL)
- Supprimer une tâche (suppression automatique des deux bases de données)

## API REST

### Interface Web (Recommandé)

L'interface web synchronise automatiquement les deux bases de données :
- **Ajout** : Les tâches sont créées simultanément dans MongoDB et PostgreSQL
- **Suppression** : Les tâches sont supprimées des deux bases en même temps
- **Affichage** : Les tâches MongoDB sont affichées (synchronisées avec PostgreSQL)

### Endpoints API directs

#### MongoDB (NoSQL)

| Méthode | Endpoint           | Description              |
|---------|-------------------|--------------------------|
| GET     | `/tasks`          | Récupérer toutes les tâches |
| POST    | `/tasks`          | Créer une tâche (MongoDB uniquement) |
| DELETE  | `/tasks/:id`      | Supprimer une tâche (MongoDB uniquement) |

#### PostgreSQL (SQL)

| Méthode | Endpoint           | Description              |
|---------|-------------------|--------------------------|
| GET     | `/tasks-pg`       | Récupérer toutes les tâches |
| POST    | `/tasks-pg`       | Créer une tâche (PostgreSQL uniquement) |
| DELETE  | `/tasks-pg/:id`   | Supprimer une tâche (PostgreSQL uniquement) |

**Note** : Pour une synchronisation automatique, utilisez l'interface web à http://localhost:3000

### Exemples MongoDB

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

### Exemples PostgreSQL

**Créer une tâche :**
```bash
curl -X POST http://localhost:3000/tasks-pg \
  -H "Content-Type: application/json" \
  -d '{"title":"Apprendre PostgreSQL"}'
```

**Voir toutes les tâches :**
```bash
curl http://localhost:3000/tasks-pg
```

**Supprimer une tâche :**
```bash
curl -X DELETE http://localhost:3000/tasks-pg/1
```

## Requêtes SQL PostgreSQL

**Voir toutes les tâches :**
```sql
SELECT * FROM tasks_pg;
```

**Voir les tâches avec tri par ID :**
```sql
SELECT id, title, created_at FROM tasks_pg ORDER BY id DESC;
```

**Compter les tâches :**
```sql
SELECT COUNT(*) FROM tasks_pg;
```

**Depuis le terminal :**
```bash
PGPASSWORD=votre_password psql -U votre_user -h localhost -d todolist -c "SELECT * FROM tasks_pg;"
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

Déploiement complet avec MongoDB et PostgreSQL :

```bash
# Lancer tous les services (MongoDB + PostgreSQL + App)
docker-compose up --build

# Lancer en arrière-plan
docker-compose up -d --build

# Voir les logs
docker-compose logs -f app

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (données)
docker-compose down -v
```

**Services Docker :**
- **app** : Application Node.js (port 3000)
- **mongodb** : Base de données MongoDB (port 27017)
- **postgres** : Base de données PostgreSQL (port 5432)

**Accès à l'application :**
- Interface web : http://localhost:3000
- API MongoDB : http://localhost:3000/tasks
- API PostgreSQL : http://localhost:3000/tasks-pg

## Structure

```
nodeToDo/
├── src/
│   ├── models/          # Modèles Mongoose (MongoDB)
│   ├── controllers/     # Logique métier (MongoDB + PostgreSQL)
│   ├── routes/          # Routes Express
│   ├── views/           # Templates Pug
│   ├── config/          # Configuration DB (MongoDB + PostgreSQL)
│   ├── app.js           # Configuration Express
│   └── server.js        # Point d'entrée
├── __tests__/           # Tests unitaires (MongoDB + PostgreSQL)
├── .env                 # Variables d'environnement
├── init-postgres.sql    # Script SQL PostgreSQL
└── package.json
```

## Technologies

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **PostgreSQL** - Base de données SQL
- **Mongoose** - ODM pour MongoDB
- **pg** - Driver PostgreSQL
- **Pug** - Moteur de templates
- **Jest** - Framework de tests
- **ESLint** - Linter
- **Prettier** - Formateur de code
- **Docker** - Conteneurisation

## Couverture des tests

**17 tests passés sur 17** ✅

- 6 tests MongoDB API (GET, POST, DELETE sur `/tasks`)
- 6 tests PostgreSQL API (GET, POST, DELETE sur `/tasks-pg`)
- 5 tests synchronisation (ajout, suppression, affichage avec les deux bases)
- **Couverture controllers : 86.95%** 🚀
- **Couverture routes : 100%**
- **Couverture models : 100%**

## Fonctionnalités

### Synchronisation automatique
- ✅ **Ajout** : Chaque tâche créée via l'interface web est enregistrée simultanément dans MongoDB et PostgreSQL
- ✅ **Suppression** : La suppression d'une tâche l'efface des deux bases de données
- ✅ **Affichage unifié** : Interface unique montrant toutes les tâches
- ✅ **Double persistance** : Redondance des données pour la résilience

### Accès direct aux bases
- API REST séparées pour MongoDB (`/tasks`) et PostgreSQL (`/tasks-pg`)
- Requêtes SQL directes sur PostgreSQL
- Requêtes via Mongoose sur MongoDB

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