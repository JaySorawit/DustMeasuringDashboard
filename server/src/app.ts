import express from 'express';
import cors from 'cors';
import dustMeasurementRoutes from './routes/dustMeasurementRoutes';
import roomDustSafetyLimitsRoutes from './routes/roomDustSafetyLimitsRoutes';

// Initialize Express app
const app = express();

// Determine the allowed origin based on the environment
const allowedOrigins = [
  'http://localhost:5173', // Development environment (localhost)
  'http://52.64.110.28' // Production environment
];


// Middleware to handle CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
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
