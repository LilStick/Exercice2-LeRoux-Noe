const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

/**
 * @swagger
 * /token/generate:
 *   post:
 *     summary: Generate a JWT token
 *     description: |
 *       Extract email and password, search user in database, verify password,
 *       and generate a JWT token with user ID and email.
 *       Token has a 1 hour expiration time, signed with secret key.
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token generated successfully
 *                 token:
 *                   type: string
 *                   description: JWT token (valid for 1 hour)
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 expiresIn:
 *                   type: string
 *                   example: 1h
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/generate', tokenController.generateToken);

/**
 * @swagger
 * /token/user:
 *   post:
 *     summary: Create a new user and generate token
 *     description: |
 *       Extract user info (username, email, password),
 *       save user with mongoose save() method,
 *       create JWT token with user ID and email.
 *       Token has 1 hour validity, signed with secret key.
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 description: Username (min 3 characters)
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Password (min 6 characters)
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully with token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 token:
 *                   type: string
 *                   description: JWT token (valid for 1 hour)
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 expiresIn:
 *                   type: string
 *                   example: 1h
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Server error
 */
router.post('/user', tokenController.createUser);

module.exports = router;
