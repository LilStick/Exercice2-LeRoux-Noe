const Task = require('../models/Task');
const { pool } = require('../config/postgres');

exports.renderTodoList = async (req, res) => {
  try {
    const mongoTasks = await Task.find();
    const pgResult = await pool.query('SELECT * FROM tasks_pg ORDER BY id DESC');
    const pgTasks = pgResult.rows;

    res.render('index', { mongoTasks, pgTasks });
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

    await Promise.all([
      Task.create({ title }),
      pool.query('INSERT INTO tasks_pg (title) VALUES ($1)', [title])
    ]);

    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTaskFromForm = async (req, res) => {
  try {
    const { id } = req.params;

    const mongoTask = await Task.findByIdAndDelete(id);

    if (mongoTask) {
      await pool.query('DELETE FROM tasks_pg WHERE title = $1', [mongoTask.title]);
    }

    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
