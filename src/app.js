const express = require('express');
const path = require('path');
const taskRoutes = require('./routes/taskRoutes');
const taskPgRoutes = require('./routes/taskPgRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/tasks', taskRoutes);
app.use('/tasks-pg', taskPgRoutes);
app.use('/', viewRoutes);

module.exports = app;
