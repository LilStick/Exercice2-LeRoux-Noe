const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const pool = require('../config/postgres');
const bcrypt = require('bcrypt');

/**
 * Configuration de la stratégie Google OAuth 2.0
 * Ne s'initialise que si les credentials Google sont configurés
 */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/oauth/google/callback',
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName || profile.emails[0].value.split('@')[0];

        const dbType = req.query.state || 'mongodb';

        if (dbType === 'postgres') {
          const checkQuery = 'SELECT * FROM users_pg WHERE email = $1';
          let result = await pool.query(checkQuery, [email]);

          if (result.rows.length > 0) {
            return done(null, {
              id: result.rows[0].id,
              username: result.rows[0].username,
              email: result.rows[0].email,
              dbType: 'postgres',
              oauth_provider: 'google',
              oauth_id: profile.id
            });
          } else {
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
            const insertQuery = `
              INSERT INTO users_pg (username, email, password, oauth_provider, oauth_id)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING *
            `;
            result = await pool.query(insertQuery, [username, email, randomPassword, 'google', profile.id]);

            return done(null, {
              id: result.rows[0].id,
              username: result.rows[0].username,
              email: result.rows[0].email,
              dbType: 'postgres',
              oauth_provider: 'google',
              oauth_id: profile.id
            });
          }
        } else {
          let user = await User.findOne({ email });

          if (user) {
            if (!user.oauth_provider) {
              user.oauth_provider = 'google';
              user.oauth_id = profile.id;
              await user.save();
            }
            return done(null, {
              id: user._id,
              username: user.username,
              email: user.email,
              dbType: 'mongodb',
              oauth_provider: 'google',
              oauth_id: profile.id
            });
          } else {
            user = new User({
              username,
              email,
              password: Math.random().toString(36),
              oauth_provider: 'google',
              oauth_id: profile.id
            });
            await user.save();

            return done(null, {
              id: user._id,
              username: user.username,
              email: user.email,
              dbType: 'mongodb',
              oauth_provider: 'google',
              oauth_id: profile.id
            });
          }
        }
      } catch (error) {
        return done(error, null);
      }
    }
  ));

  console.log(' Google OAuth 2.0 strategy initialized');
} else {
  console.log('Google OAuth 2.0 not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}

passport.serializeUser((user, done) => {
  done(null, { id: user.id, dbType: user.dbType });
});

passport.deserializeUser(async (sessionData, done) => {
  try {
    if (sessionData.dbType === 'postgres') {
      const query = 'SELECT * FROM users_pg WHERE id = $1';
      const result = await pool.query(query, [sessionData.id]);

      if (result.rows.length > 0) {
        return done(null, {
          id: result.rows[0].id,
          username: result.rows[0].username,
          email: result.rows[0].email,
          dbType: 'postgres'
        });
      }
    } else {
      const user = await User.findById(sessionData.id);
      if (user) {
        return done(null, {
          id: user._id,
          username: user.username,
          email: user.email,
          dbType: 'mongodb'
        });
      }
    }
    done(null, false);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
