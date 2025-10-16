const express = require('express');
const router = express.Router();
const taskPgController = require('../controllers/taskPgController');

router.get('/', taskPgController.getTasksPg);
router.post('/', taskPgController.addTaskPg);
router.delete('/:id', taskPgController.removeTaskPg);

module.exports = router;
