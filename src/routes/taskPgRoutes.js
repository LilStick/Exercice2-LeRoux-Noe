const express = require('express');
const router = express.Router();
const taskPgController = require('../controllers/taskPgController');

/**
 * @swagger
 * tags:
 *   name: Tasks (PostgreSQL)
 *   description: PostgreSQL task management
 */

/**
 * @swagger
 * /tasks-pg:
 *   get:
 *     summary: Get all PostgreSQL tasks
 *     tags: [Tasks (PostgreSQL)]
 *     description: Retrieve all tasks stored in PostgreSQL
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaskPg'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', taskPgController.getTasksPg);

/**
 * @swagger
 * /tasks-pg:
 *   post:
 *     summary: Create a new PostgreSQL task
 *     tags: [Tasks (PostgreSQL)]
 *     description: Add a new task to PostgreSQL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/TaskPg'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', taskPgController.addTaskPg);

/**
 * @swagger
 * /tasks-pg/{id}:
 *   delete:
 *     summary: Delete a PostgreSQL task
 *     tags: [Tasks (PostgreSQL)]
 *     description: Delete an existing task from PostgreSQL by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: PostgreSQL task ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task removed
 *                 task:
 *                   $ref: '#/components/schemas/TaskPg'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', taskPgController.removeTaskPg);

module.exports = router;
