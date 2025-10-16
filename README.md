# TodoList API

API REST simple pour gérer une liste de tâches avec Node.js, Express, MongoDB et PostgreSQL.

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