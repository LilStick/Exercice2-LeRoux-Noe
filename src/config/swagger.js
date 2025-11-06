const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node Todo API',
      version: '1.0.0',
      description: 'Task management API with MongoDB and PostgreSQL',
      contact: {
        name: 'API Support',
        email: 'support@nodetodo.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB task ID',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Buy bread',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Update date',
            },
          },
        },
        TaskPg: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'integer',
              description: 'PostgreSQL task ID',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Buy milk',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date',
            },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'My new task',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'An error occurred',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation successful',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
