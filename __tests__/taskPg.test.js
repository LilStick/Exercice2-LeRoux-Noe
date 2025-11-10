const request = require('supertest');
const app = require('../src/app.noauth');
const { pool } = require('../src/config/postgres');

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks_pg (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

afterAll(async () => {
  await pool.query('TRUNCATE TABLE tasks_pg RESTART IDENTITY CASCADE');
  await pool.end();
});

beforeEach(async () => {
  await pool.query('TRUNCATE TABLE tasks_pg RESTART IDENTITY CASCADE');
});

describe('PostgreSQL Task API', () => {
  describe('GET /tasks-pg', () => {
    it('should return empty array when no tasks', async () => {
      const response = await request(app).get('/tasks-pg');

      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual([]);
    });

    it('should return all tasks', async () => {
      await pool.query("INSERT INTO tasks_pg (title) VALUES ('Task 1')");
      await pool.query("INSERT INTO tasks_pg (title) VALUES ('Task 2')");

      const response = await request(app).get('/tasks-pg');

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(2);
    });
  });

  describe('POST /tasks-pg', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/tasks-pg')
        .send({ title: 'New Task' });

      expect(response.status).toBe(201);
      expect(response.body.task.title).toBe('New Task');
      expect(response.body.task.id).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/tasks-pg')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('DELETE /tasks-pg/:id', () => {
    it('should delete a task', async () => {
      const result = await pool.query(
        "INSERT INTO tasks_pg (title) VALUES ('Task to delete') RETURNING *"
      );
      const taskId = result.rows[0].id;

      const response = await request(app).delete(`/tasks-pg/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task removed');

      const checkResult = await pool.query(
        'SELECT * FROM tasks_pg WHERE id = $1',
        [taskId]
      );
      expect(checkResult.rows).toHaveLength(0);
    });

    it('should return 404 if task not found', async () => {
      const response = await request(app).delete('/tasks-pg/99999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });
});
