import express from 'express';
import {
    getDustMeasurementsHandler,
    createDustMeasurementHandler,
    getDustMeasurementDataByDateRangeHandler,
    getDustMeasurementLocationHandler,
} from '../controllers/dustMeasurementController';

const router = express.Router();

// Define API routes for Dust Measurements
router.get('/', getDustMeasurementsHandler);  // For all measurements
router.post('/date-range', getDustMeasurementDataByDateRangeHandler); // For measurements by date range
router.get('/locations', getDustMeasurementLocationHandler); // For search location
router.post('/', createDustMeasurementHandler); // To create new measurement

export default router;
