const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { authMiddlewareWeb } = require('../middleware/authWeb');

router.get('/register', viewController.renderRegister);
router.post('/register', viewController.handleRegister);
router.get('/login', viewController.renderLogin);
router.post('/login', viewController.handleLogin);
router.get('/logout', viewController.handleLogout);

router.get('/', authMiddlewareWeb, viewController.renderTodoList);
router.post('/tasks/add', authMiddlewareWeb, viewController.addTaskFromForm);
router.post('/tasks/delete/:id', authMiddlewareWeb, viewController.deleteTaskFromForm);

module.exports = router;
