const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { pool } = require('../config/postgres');

const DATABASE_MODE = process.env.DATABASE_MODE || 'both';

exports.generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let user = null;
    let userId = null;

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      try {
        user = await User.findOne({ email });

        if (user) {
          const isPasswordValid = await user.comparePassword(password);

          if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }

          userId = user._id.toString();
        }
      } catch {
      }
    }

    if (!user && (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both')) {
      const result = await pool.query('SELECT * FROM users_pg WHERE email = $1', [email]);

      if (result.rows.length > 0) {
        const pgUser = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, pgUser.password);

        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        user = pgUser;
        userId = pgUser.id.toString();
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: userId,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.json({
      message: 'Token generated successfully',
      token,
      expiresIn: '1h',
      user: {
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    let createdUser = null;

    if (DATABASE_MODE === 'mongodb' || DATABASE_MODE === 'both') {
      try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({
          username,
          email,
          password
        });

        createdUser = await newUser.save();
      } catch {
      }
    }

    if (DATABASE_MODE === 'postgresql' || DATABASE_MODE === 'both') {
      const existingUser = await pool.query(
        'SELECT * FROM users_pg WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0 && DATABASE_MODE === 'postgresql') {
        return res.status(400).json({ error: 'User already exists' });
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
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const userId = createdUser._id ? createdUser._id.toString() : createdUser.id.toString();
    const token = jwt.sign(
      {
        id: userId,
        email: createdUser.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      expiresIn: '1h',
      user: {
        username: createdUser.username,
        email: createdUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
