const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const taskRoutes = require('./routes/taskRoutes');
const taskPgRoutes = require('./routes/taskPgRoutes');
const viewRoutesNoAuth = require('./routes/viewRoutes.noauth');
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Node Todo API Documentation',
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/auth', authRoutes);
app.use('/oauth', oauthRoutes);
app.use('/token', tokenRoutes);
app.use('/tasks', taskRoutes);
app.use('/tasks-pg', taskPgRoutes);
app.use('/', viewRoutesNoAuth);

module.exports = app;
