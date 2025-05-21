process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});


const httpServer = require('./index'); // Import the app instance
const sequelize = require('./config/db');

const { initSocket } = require('./config/socketIO');
require('dotenv').config(); // Load environment variables


const io = initSocket(httpServer);
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await sequelize.authenticate();
      console.log('✅ Connection has been established successfully.');

      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      return; // Exit the function after successful start
    } catch (err) {
      retries++;
      console.error(`Failed to connect to DB (attempt ${retries}):`, err.message);
      if (retries >= MAX_RETRIES) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      // Wait before retrying
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};


// Start the app
startServer();
