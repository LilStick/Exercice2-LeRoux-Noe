const taskModel = require('../models/TaskModel');

exports.getTasks = (req, res) => {
  const tasks = taskModel.getAll();
  res.json({ tasks });
};

exports.addTask = (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = taskModel.add(title);
  res.status(201).json({ task });
};

exports.removeTask = (req, res) => {
  const { id } = req.params;
  const task = taskModel.remove(id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ message: 'Task removed', task });
};
