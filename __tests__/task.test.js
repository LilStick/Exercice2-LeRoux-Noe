const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Task = require('../src/models/Task');

beforeAll(async () => {
  const mongoUri = 'mongodb://localhost:27017/todolist-test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Task API', () => {
  describe('GET /tasks', () => {
    it('should return empty array when no tasks', async () => {
      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body.tasks).toEqual([]);
    });

    it('should return all tasks', async () => {
      await Task.create({ title: 'Task 1' });
      await Task.create({ title: 'Task 2' });

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(2);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'New Task' });

      expect(response.status).toBe(201);
      expect(response.body.task.title).toBe('New Task');
      expect(response.body.task._id).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({ title: 'Task to delete' });

      const response = await request(app).delete(`/tasks/${task._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task removed');

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 if task not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/tasks/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });
});
