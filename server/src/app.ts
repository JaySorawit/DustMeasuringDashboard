import express from 'express';
import cors from 'cors';
import dustMeasurementRoutes from './routes/dustMeasurementRoutes';
import roomDustSafetyLimitsRoutes from './routes/roomDustSafetyLimitsRoutes';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: 'http://52.64.110.28'
  }));
app.use(express.json()); // Parse incoming JSON requests

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Dust Measurement API!');
});

// Define API routes
app.use('/api/dust-measurements', dustMeasurementRoutes);
app.use('/api/room-management', roomDustSafetyLimitsRoutes);

// Export the app for server.ts
export default app;
