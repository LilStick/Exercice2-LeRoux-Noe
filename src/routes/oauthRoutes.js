const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');
const { authLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: OAuth
 *   description: Authentification OAuth 2.0
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initier l'authentification Google OAuth 2.0
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: db
 *         schema:
 *           type: string
 *           enum: [mongodb, postgres]
 *         description: Type de base de données (mongodb par défaut)
 *     responses:
 *       302:
 *         description: Redirection vers Google pour authentification
 */
router.get('/google', authLimiter, oauthController.initiateGoogleAuth);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback après authentification Google
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirection après authentification réussie ou échec
 */
router.get('/google/callback',
  oauthController.googleCallback,
  oauthController.handleOAuthSuccess
);

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Vérifier le statut d'authentification
 *     tags: [OAuth]
 *     responses:
 *       200:
 *         description: Statut d'authentification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     dbType:
 *                       type: string
 */
router.get('/status', oauthController.checkAuthStatus);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Déconnexion OAuth
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirection vers la page de connexion
 */
router.get('/logout', oauthController.logout);

module.exports = router;
