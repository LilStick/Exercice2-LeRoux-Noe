const User = require('../models/User');
const { pool } = require('../config/postgres');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');

const DATABASE_MODE = process.env.DATABASE_MODE || 'both';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    let userId;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create({ username, email, password });
      userId = user._id;
    }

    if (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both') {
      const existingUser = await pool.query(
        'SELECT * FROM users_pg WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const result = await pool.query(
        'INSERT INTO users_pg (username, email, password) VALUES ($1, $2, $3) RETURNING id',
        [username, email, hashedPassword]
      );
      userId = result.rows[0].id;
    }

    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { username, email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let user;
    let userId;
    let isPasswordValid = false;

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      user = await User.findOne({ email });
      if (user) {
        isPasswordValid = await user.comparePassword(password);
        userId = user._id;
      }
    }

    if (!user && (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both')) {
      const result = await pool.query('SELECT * FROM users_pg WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        user = result.rows[0];
        isPasswordValid = await bcrypt.compare(password, user.password);
        userId = user.id;
      }
    }

    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(userId);

    res.json({
      message: 'Login successful',
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    let user;

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      try {
        user = await User.findById(userId).select('-password');
      } catch {
        // If userId is not a valid ObjectId, skip MongoDB
      }
    }

    if (!user && (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both')) {
      const result = await pool.query(
        'SELECT id, username, email, created_at, updated_at FROM users_pg WHERE id = $1',
        [userId]
      );
      user = result.rows[0];
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
