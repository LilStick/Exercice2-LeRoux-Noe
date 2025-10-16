const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router.get('/', viewController.renderTodoList);
router.post('/tasks/add', viewController.addTaskFromForm);
router.post('/tasks/delete/:id', viewController.deleteTaskFromForm);

module.exports = router;
