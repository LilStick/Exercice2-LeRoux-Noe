-- Script SQL pour créer la table des tâches dans PostgreSQL

-- Se connecter à la base de données todolist
-- \c todolist

-- Créer la table tasks_pg
CREATE TABLE IF NOT EXISTS tasks_pg (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table users_pg pour l'authentification
CREATE TABLE IF NOT EXISTS users_pg (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  oauth_provider VARCHAR(50) DEFAULT 'local',
  oauth_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vérifier les tables
\d tasks_pg
\d users_pg

-- Exemple de données
-- INSERT INTO tasks_pg (title) VALUES ('Ma première tâche');
-- SELECT * FROM tasks_pg;
