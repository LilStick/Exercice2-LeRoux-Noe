const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.addTask);
router.delete('/tasks/:id', taskController.removeTask);

module.exports = router;
