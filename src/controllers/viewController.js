const Task = require('../models/Task');

exports.renderTodoList = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTaskFromForm = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.redirect('/');
    }
    await Task.create({ title });
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTaskFromForm = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
