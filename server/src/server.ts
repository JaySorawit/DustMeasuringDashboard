// src/server.ts
import app from './app';              // Import Express app
import sequelize from './database';   // Import Sequelize instance to ensure DB connection is established

// Start the server after confirming the database connection
const port = process.env.PORT || 3000;

sequelize.authenticate()  // Test the database connection
    .then(() => {
        console.log('Database connected!');
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });
