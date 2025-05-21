const httpServer = require('./index'); // Import the app instance
const sequelize = require('./config/db');

const { initSocket } = require('./config/socketIO');
require('dotenv').config(); // Load environment variables


const io = initSocket(httpServer);
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    // await sequelize.sync({ alter: true }); // ✅ Await this!
    // console.log('✅ Models synced successfully.');
    // Start the server
    httpServer.listen(PORT, () => {
      console.log(`Server running on port 3000`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1); // Exit with failure code
  }
};

// Start the app
startServer();
