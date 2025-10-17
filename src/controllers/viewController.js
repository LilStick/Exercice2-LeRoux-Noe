const Task = require('../models/Task');
const { pool } = require('../config/postgres');

const DATABASE_MODE = process.env.DATABASE_MODE || 'both';

exports.renderTodoList = async (req, res) => {
  try {
    let mongoTasks = [];
    let pgTasks = [];

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      mongoTasks = await Task.find();
    }

    if (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both') {
      const pgResult = await pool.query('SELECT * FROM tasks_pg ORDER BY id DESC');
      pgTasks = pgResult.rows;
    }

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

    const promises = [];

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      promises.push(Task.create({ title }));
    }

    if (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both') {
      promises.push(pool.query('INSERT INTO tasks_pg (title) VALUES ($1)', [title]));
    }

    await Promise.all(promises);

    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTaskFromForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { db } = req.query;

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      if (!db || db === 'mongo') {
        const mongoTask = await Task.findByIdAndDelete(id);

        if (DATABASE_MODE === 'both' && mongoTask) {
          await pool.query('DELETE FROM tasks_pg WHERE title = $1', [mongoTask.title]);
        }
      }
    }

    if (DATABASE_MODE === 'postgresql' || (DATABASE_MODE === 'both' && db === 'postgres')) {
      await pool.query('DELETE FROM tasks_pg WHERE id = $1', [id]);
    }

    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
