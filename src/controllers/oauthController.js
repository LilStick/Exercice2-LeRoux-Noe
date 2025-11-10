const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

/**
 * Controller pour l'authentification OAuth 2.0
 */

/**
 * @route GET /auth/google
 * @description Initie l'authentification Google OAuth
 */
const initiateGoogleAuth = (req, res, next) => {
  const dbType = req.query.db || 'mongodb';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: dbType
  })(req, res, next);
};

/**
 * @route GET /auth/google/callback
 * @description Callback après authentification Google
 */
const googleCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/login?error=oauth_failed',
    session: true
  })(req, res, next);
};

/**
 * @description Gestion après succès OAuth
 */
const handleOAuthSuccess = (req, res) => {
  try {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        dbType: req.user.dbType
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });

    res.redirect('/?oauth_success=true');
  } catch (error) {
    console.error('Erreur lors de la génération du token OAuth:', error);
    res.redirect('/login?error=token_generation_failed');
  }
};

/**
 * @route GET /auth/logout
 * @description Déconnexion (logout)
 */
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
    res.clearCookie('token');
    res.redirect('/login?message=logged_out');
  });
};

/**
 * @route GET /auth/status
 * @description Vérifier le statut d'authentification
 */
const checkAuthStatus = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        dbType: req.user.dbType
      }
    });
  }
  res.json({ authenticated: false });
};

module.exports = {
  initiateGoogleAuth,
  googleCallback,
  handleOAuthSuccess,
  logout,
  checkAuthStatus
};

module.exports = {
  initiateGoogleAuth,
  googleCallback,
  handleOAuthSuccess,
  logout,
  checkAuthStatus
};
