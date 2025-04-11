const app = require('./index'); // Import the app instance
const sequelize = require('./config/db');

require('dotenv').config(); // Load environment variables

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    await sequelize.sync({ alter: true }); // ✅ Await this!
    console.log('✅ Models synced successfully.');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1); // Exit with failure code
  }
};

// Start the app
startServer();
