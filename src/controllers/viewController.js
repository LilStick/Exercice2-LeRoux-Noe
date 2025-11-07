const Task = require('../models/Task');
const User = require('../models/User');
const { pool } = require('../config/postgres');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const DATABASE_MODE = process.env.DATABASE_MODE || 'both';

exports.renderRegister = (req, res) => {
  res.render('register');
};

exports.handleRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.render('register', { error: 'All fields are required' });
    }

    if (username.length < 3) {
      return res.render('register', { error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.render('register', { error: 'Password must be at least 6 characters' });
    }

    let createdUser = null;

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
          return res.render('register', { error: 'User already exists with this email or username' });
        }

        const newUser = new User({ username, email, password });
        createdUser = await newUser.save();
      } catch (err) {
        if (err.code === 11000) {
          return res.render('register', { error: 'User already exists' });
        }
      }
    }

    if (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both') {
      const existingUser = await pool.query(
        'SELECT * FROM users_pg WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0 && DATABASE_MODE === 'postgresql') {
        return res.render('register', { error: 'User already exists with this email or username' });
      }

      if (existingUser.rows.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
          'INSERT INTO users_pg (username, email, password) VALUES ($1, $2, $3) RETURNING *',
          [username, email, hashedPassword]
        );

        if (!createdUser) {
          createdUser = result.rows[0];
        }
      }
    }

    if (!createdUser) {
      return res.render('register', { error: 'Failed to create user' });
    }

    return res.render('register', {
      success: 'Account created successfully! You can now login.'
    });
  } catch (error) {
    res.render('register', { error: error.message });
  }
};

exports.renderLogin = (req, res) => {
  res.render('login');
};

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('login', { error: 'Email and password are required' });
    }

    let user = null;
    let userId = null;
    let username = null;

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      try {
        user = await User.findOne({ email });

        if (user) {
          const isPasswordValid = await user.comparePassword(password);

          if (!isPasswordValid) {
            return res.render('login', { error: 'Invalid credentials' });
          }

          userId = user._id.toString();
          username = user.username;
        }
      } catch {
        // MongoDB not available
      }
    }

    if (!user && (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both')) {
      const result = await pool.query('SELECT * FROM users_pg WHERE email = $1', [email]);

      if (result.rows.length > 0) {
        const pgUser = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, pgUser.password);

        if (!isPasswordValid) {
          return res.render('login', { error: 'Invalid credentials' });
        }

        user = pgUser;
        userId = pgUser.id.toString();
        username = pgUser.username;
      }
    }

    if (!user) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: userId, email: user.email, username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    res.redirect('/');
  } catch (error) {
    res.render('login', { error: error.message });
  }
};

exports.handleLogout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

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

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    res.render('index', {
      mongoTasks,
      pgTasks,
      username: decoded.username,
      email: decoded.email
    });
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
