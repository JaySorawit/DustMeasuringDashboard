// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dustMeasurementRoutes from './routes/dustMeasurementRoutes';


dotenv.config();  // Load environment variables from .env file

// Initialize Express app
const app = express();

// Middleware
app.use(cors());           // Allow cross-origin requests
app.use(express.json());   // Parse incoming JSON requests

// Define API routes
app.use('/api/dust-measurements', dustMeasurementRoutes);

export default app;
