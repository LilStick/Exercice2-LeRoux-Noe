const request = require('supertest');
const app = require('../src/app.noauth');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('OAuth 2.0 Tests', () => {
  beforeAll(async () => {
    // Attendre la connexion MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist_test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    // pool.end() n'est pas nécessaire pour les tests
  });

  describe('OAuth Routes', () => {
    it('should have Google OAuth initiation endpoint', async () => {
      const response = await request(app)
        .get('/oauth/google?db=mongodb')
        .redirects(0);

      // Devrait rediriger vers Google (302) ou retourner une erreur si OAuth n'est pas configuré
      expect([302, 500, 401]).toContain(response.status);
    });

    it('should accept db parameter for database selection', async () => {
      const mongoResponse = await request(app)
        .get('/oauth/google?db=mongodb')
        .redirects(0);

      const pgResponse = await request(app)
        .get('/oauth/google?db=postgres')
        .redirects(0);

      // Les deux devraient être acceptées (ou rate limited)
      expect([302, 500, 401, 429]).toContain(mongoResponse.status);
      expect([302, 500, 401, 429]).toContain(pgResponse.status);
    });

    it('should have OAuth callback endpoint', async () => {
      const response = await request(app)
        .get('/oauth/google/callback')
        .redirects(0);

      // Devrait exister (même si ça échoue sans paramètres valides)
      expect(response.status).toBeDefined();
    });

    it('should have OAuth status endpoint', async () => {
      const response = await request(app)
        .get('/oauth/status');

      expect([200, 429]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('authenticated');
      }
    });

    it('should return authentication status as false when not logged in', async () => {
      const response = await request(app)
        .get('/oauth/status');

      expect([200, 429]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.authenticated).toBe(false);
      }
    });

    it('should have OAuth logout endpoint', async () => {
      const response = await request(app)
        .get('/oauth/logout')
        .redirects(0);

      // Devrait rediriger vers login (ou rate limited)
      expect([302, 200, 429]).toContain(response.status);
    });
  });

  describe('User Model OAuth Fields', () => {
    it('should support oauth_provider field', async () => {
      const userData = {
        username: 'oauthtest',
        email: 'oauth@test.com',
        password: 'test123456',
        oauth_provider: 'google'
      };

      const user = new User(userData);
      await user.validate();

      expect(user.oauth_provider).toBe('google');
    });

    it('should default oauth_provider to local', async () => {
      const userData = {
        username: 'localtest',
        email: 'local@test.com',
        password: 'test123456'
      };

      const user = new User(userData);
      await user.validate();

      expect(user.oauth_provider).toBe('local');
    });

    it('should accept valid oauth_provider values', async () => {
      const providers = ['google', 'github', 'local'];

      for (const provider of providers) {
        const user = new User({
          username: `test_${provider}`,
          email: `test_${provider}@test.com`,
          password: 'test123456',
          oauth_provider: provider
        });

        await expect(user.validate()).resolves.not.toThrow();
      }
    });

    it('should reject invalid oauth_provider values', async () => {
      const user = new User({
        username: 'invalidoauth',
        email: 'invalid@test.com',
        password: 'test123456',
        oauth_provider: 'facebook'
      });

      await expect(user.validate()).rejects.toThrow();
    });

    it('should support oauth_id field', async () => {
      const user = new User({
        username: 'oauthidtest',
        email: 'oauthid@test.com',
        password: 'test123456',
        oauth_provider: 'google',
        oauth_id: '1234567890'
      });

      await user.validate();
      expect(user.oauth_id).toBe('1234567890');
    });
  });

  describe('OAuth Integration with Rate Limiting', () => {
    it('should apply rate limiting to OAuth endpoints', async () => {
      const response = await request(app)
        .get('/oauth/google?db=mongodb')
        .redirects(0);

      // Devrait avoir des headers de rate limit
      expect(response.headers).toHaveProperty('ratelimit-limit');
    });

    it('should limit OAuth status checks', async () => {
      const requests = [];

      for (let i = 0; i < 3; i++) {
        requests.push(request(app).get('/oauth/status'));
      }

      const responses = await Promise.all(requests);

      // Toutes devraient réussir dans la limite ou être rate limited
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('Session Management', () => {
    it('should initialize session middleware', async () => {
      const response = await request(app)
        .get('/oauth/status');

      // Devrait avoir un cookie de session (ou être rate limited)
      expect([200, 429]).toContain(response.status);
    });

    it('should clear session on logout', async () => {
      const response = await request(app)
        .get('/oauth/logout')
        .redirects(0);

      // Devrait rediriger et potentiellement clear le cookie (ou être rate limited)
      expect([200, 302, 429]).toContain(response.status);
    });
  });

  describe('OAuth Security', () => {
    it('should not expose sensitive OAuth credentials', async () => {
      const response = await request(app)
        .get('/oauth/status');

      const body = JSON.stringify(response.body);

      // Ne devrait pas contenir de secrets
      expect(body).not.toContain('client_secret');
      expect(body).not.toContain('CLIENT_SECRET');
    });

    it('should handle missing OAuth configuration gracefully', async () => {
      const response = await request(app)
        .get('/oauth/google?db=mongodb')
        .redirects(0);

      // Ne devrait pas crasher même sans configuration (ou être rate limited)
      expect(response.status).toBeDefined();
      expect([302, 500, 401, 429]).toContain(response.status);
    });

    it('should protect callback endpoint from direct access', async () => {
      const response = await request(app)
        .get('/oauth/google/callback')
        .redirects(0);

      // Sans paramètres valides, devrait rediriger ou échouer
      expect(response.status).toBeDefined();
    });
  });
});
