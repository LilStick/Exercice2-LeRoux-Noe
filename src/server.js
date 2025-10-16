const app = require('./app');
const connectDB = require('./config/database');
const { initPostgres } = require('./config/postgres');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

Promise.all([connectDB(), initPostgres()]).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
