require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log(' Database connection successful');

    // Start server
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(` API Base URL: http://localhost:${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
      console.log(`\n Available Endpoints:`);
      console.log(`   POST   /api/events              - Create event`);
      console.log(`   GET    /api/events/:id          - Get event details`);
      console.log(`   POST   /api/events/register     - Register for event`);
      console.log(`   POST   /api/events/cancel       - Cancel registration`);
      console.log(`   GET    /api/events/upcoming     - List upcoming events`);
      console.log(`   GET    /api/events/:id/stats    - Get event stats`);
      console.log(`   POST   /api/users               - Create user`);
      console.log(`   GET    /api/users               - Get all users`);
      console.log(`   GET    /api/users/:id           - Get user by ID`);
      console.log(`   GET    /api/users/:id/events    - Get user's events`);
    });
  } catch (error) {
    console.error(' Failed to connect to database:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

startServer();