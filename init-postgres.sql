-- Script SQL pour créer la table des tâches dans PostgreSQL

-- Se connecter à la base de données todolist
-- \c todolist

-- Créer la table tasks_pg
CREATE TABLE IF NOT EXISTS tasks_pg (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vérifier la table
\d tasks_pg

-- Exemple de données
-- INSERT INTO tasks_pg (title) VALUES ('Ma première tâche');
-- SELECT * FROM tasks_pg;
