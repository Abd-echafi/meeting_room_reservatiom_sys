const httpServer = require('./index'); // Import the app instance
const sequelize = require('./config/db');

const { initSocket } = require('./config/socketIO');
require('dotenv').config(); // Load environment variables


const io = initSocket(httpServer);
const PORT = process.env.PORT || 5000;

const keepDBAlive = async () => {
  try {
    await sequelize.query('SELECT 1');  // lightweight query to ping DB
    console.log('🔄 DB keep-alive ping sent');
  } catch (err) {
    console.error('❌ Failed DB ping:', err.message);
  }
};
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    // await sequelize.sync({ alter: true });
    httpServer.listen(PORT, () => {
      console.log(`Server running on port 3000`);
    });
    setInterval(keepDBAlive, 1000 * 60 * 5);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};


startServer();
