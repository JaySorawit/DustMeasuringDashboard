import app from './app'; // Import the Express app
import sequelize from './database'; // Import Sequelize instance

// Define server port
const port = process.env.PORT || 3000;

// Start the server after ensuring database connection
(async () => {
    try {
        // Ensure that the database connection works
        await sequelize.authenticate();
        console.log('Database connected successfully!');

        // Sync database structure if necessary
        await sequelize.sync({ alter: false })
        .then(() => console.log('Database structure checked!'))
        .catch((error) => console.error('Error syncing database:', error));   

        // Start Express server
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();
