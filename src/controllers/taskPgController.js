const { pool } = require('../config/postgres');

exports.getTasksPg = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks_pg ORDER BY id DESC');
    res.json({ tasks: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTaskPg = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks_pg (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeTaskPg = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM tasks_pg WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task removed', task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
