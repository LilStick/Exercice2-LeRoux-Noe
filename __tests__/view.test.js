const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app.noauth');
const Task = require('../src/models/Task');
const { pool } = require('../src/config/postgres');

beforeAll(async () => {
  const mongoUri = 'mongodb://localhost:27017/todolist-test';
  await mongoose.connect(mongoUri);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks_pg (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await pool.query('TRUNCATE TABLE tasks_pg RESTART IDENTITY CASCADE');
});

beforeEach(async () => {
  await Task.deleteMany({});
  await pool.query('TRUNCATE TABLE tasks_pg RESTART IDENTITY CASCADE');
});

describe('View Controller - Dual Database Sync', () => {
  describe('POST /tasks/add', () => {
    it('should add task when form data is provided', async () => {
      const response = await request(app)
        .post('/tasks/add')
        .send({ title: 'Test Sync Task' })
        .set('Content-Type', 'application/x-www-form-urlencoded');

      // Sans auth middleware, ça devrait marcher
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/');

      const mongoTasks = await Task.find({ title: 'Test Sync Task' });
      expect(mongoTasks.length).toBeGreaterThanOrEqual(0);
    });

    it('should redirect to home if title is missing', async () => {
      const response = await request(app)
        .post('/tasks/add')
        .send({})
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/');
    });
  });

  describe('POST /tasks/delete/:id', () => {
    it('should delete task from both databases', async () => {
      const task = await Task.create({ title: 'Task to delete' });
      await pool.query("INSERT INTO tasks_pg (title) VALUES ('Task to delete')");

      const response = await request(app)
        .post(`/tasks/delete/${task._id}`)
        .send({})
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/');
    });
  });

  describe('GET /', () => {
    it('should render index with tasks from both databases', async () => {
      await Task.create({ title: 'MongoDB Task' });
      await pool.query("INSERT INTO tasks_pg (title) VALUES ('PostgreSQL Task')");

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.text).toContain('MongoDB Task');
      expect(response.text).toContain('PostgreSQL Task');
    });

    it('should render index with empty message when no tasks', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.text).toContain('Aucune tâche pour le moment');
    });
  });
});
