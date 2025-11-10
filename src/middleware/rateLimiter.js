const rateLimit = require('express-rate-limit');

/**
 * Rate limiter général pour toutes les routes
 * Limite: 100 requêtes par 15 minutes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par fenêtre
  message: {
    error: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiter strict pour les endpoints d'authentification
 * Limite: 5 tentatives par 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite à 5 tentatives par fenêtre
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Ne pas compter les requêtes réussies
});

/**
 * Rate limiter pour la création de tokens
 * Limite: 10 tokens par heure
 */
const tokenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10,
  message: {
    error: 'Limite de génération de tokens atteinte. Veuillez réessayer dans 1 heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les opérations CRUD
 * Limite: 50 requêtes par 10 minutes
 */
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,
  message: {
    error: 'Trop de requêtes API. Veuillez réessayer dans 10 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter très strict pour les opérations sensibles
 * Limite: 3 tentatives par 5 minutes
 */
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: {
    error: 'Trop de tentatives. Compte temporairement bloqué pour 5 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  tokenLimiter,
  apiLimiter,
  strictLimiter
};
