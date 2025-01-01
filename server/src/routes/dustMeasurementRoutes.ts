import express from 'express';
import {
    getDustMeasurements,
    createDustMeasurement,
    getDustMeasurementDataByDateRangeHandler,
    getDustMeasurementLocationHandler,
} from '../controllers/dustMeasurementController';

const router = express.Router();

router.get('/', getDustMeasurements);  // For all measurements
router.get('/date-range', getDustMeasurementDataByDateRangeHandler); // For measurements by date range
router.get('/locations', getDustMeasurementLocationHandler); // For search location
router.post('/', createDustMeasurement); // To create new measurement

export default router;
