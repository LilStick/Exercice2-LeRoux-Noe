const app = require('./app');
const connectDB = require('./config/database');
const { initPostgres } = require('./config/postgres');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

Promise.allSettled([connectDB(), initPostgres()]).then((results) => {
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const dbName = index === 0 ? 'MongoDB' : 'PostgreSQL';
      console.warn(`${dbName} is not available, but server is starting anyway`);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
});