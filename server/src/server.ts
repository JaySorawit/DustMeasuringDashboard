import app from './app'; // Import the Express app
import sequelize from './database'; // Import Sequelize instance

// Define server port
const port = process.env.PORT || 3000;

// Start the server after ensuring database connection
(async () => {
    try {
        // Sync Sequelize models with the database
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully!');

        // Start Express server
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
})();
