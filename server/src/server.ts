import app from './app';              // Import Express app
import sequelize from './database';   // Import Sequelize instance to ensure DB connection is established

// Start the server after confirming the database connection
const port = process.env.PORT || 3000;

sequelize.sync()  // Test the database connection and sync models
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });
