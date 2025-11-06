const request = require('supertest');
const app = require('../src/app');

describe('Swagger Documentation', () => {
  describe('GET /api-docs.json', () => {
    it('should return swagger JSON specification', async () => {
      const response = await request(app).get('/api-docs.json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('openapi');
      expect(response.body.openapi).toBe('3.0.0');
    });

    it('should have correct API info', async () => {
      const response = await request(app).get('/api-docs.json');

      expect(response.body.info).toHaveProperty('title');
      expect(response.body.info.title).toBe('Node Todo API');
      expect(response.body.info).toHaveProperty('version');
      expect(response.body.info.version).toBe('1.0.0');
    });

    it('should have all required paths', async () => {
      const response = await request(app).get('/api-docs.json');

      expect(response.body.paths).toHaveProperty('/tasks');
      expect(response.body.paths).toHaveProperty('/tasks/{id}');
      expect(response.body.paths).toHaveProperty('/tasks-pg');
      expect(response.body.paths).toHaveProperty('/tasks-pg/{id}');
    });

    it('should have MongoDB tasks endpoints', async () => {
      const response = await request(app).get('/api-docs.json');

      expect(response.body.paths['/tasks']).toHaveProperty('get');
      expect(response.body.paths['/tasks']).toHaveProperty('post');
      expect(response.body.paths['/tasks/{id}']).toHaveProperty('delete');
    });

    it('should have PostgreSQL tasks endpoints', async () => {
      const response = await request(app).get('/api-docs.json');

      expect(response.body.paths['/tasks-pg']).toHaveProperty('get');
      expect(response.body.paths['/tasks-pg']).toHaveProperty('post');
      expect(response.body.paths['/tasks-pg/{id}']).toHaveProperty('delete');
    });

    it('should have required schemas', async () => {
      const response = await request(app).get('/api-docs.json');

      expect(response.body.components.schemas).toHaveProperty('Task');
      expect(response.body.components.schemas).toHaveProperty('TaskPg');
      expect(response.body.components.schemas).toHaveProperty('TaskInput');
      expect(response.body.components.schemas).toHaveProperty('Error');
    });

    it('should have correct Task schema', async () => {
      const response = await request(app).get('/api-docs.json');

      const taskSchema = response.body.components.schemas.Task;
      expect(taskSchema.type).toBe('object');
      expect(taskSchema.required).toContain('title');
      expect(taskSchema.properties).toHaveProperty('_id');
      expect(taskSchema.properties).toHaveProperty('title');
    });

    it('should have correct TaskPg schema', async () => {
      const response = await request(app).get('/api-docs.json');

      const taskPgSchema = response.body.components.schemas.TaskPg;
      expect(taskPgSchema.type).toBe('object');
      expect(taskPgSchema.required).toContain('title');
      expect(taskPgSchema.properties).toHaveProperty('id');
      expect(taskPgSchema.properties).toHaveProperty('title');
    });

    it('should have correct tags', async () => {
      const response = await request(app).get('/api-docs.json');

      expect(response.body.tags).toBeDefined();
      expect(response.body.tags.length).toBeGreaterThan(0);

      const tagNames = response.body.tags.map(tag => tag.name);
      expect(tagNames).toContain('Tasks (MongoDB)');
      expect(tagNames).toContain('Tasks (PostgreSQL)');
    });
  });

  describe('GET /api-docs', () => {
    it('should redirect to swagger UI', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.status).toBe(200);
      expect(response.text).toContain('swagger-ui');
    });
  });
});
