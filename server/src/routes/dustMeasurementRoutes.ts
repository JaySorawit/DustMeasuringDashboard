import express from 'express';
import {
    getDustMeasurements,
    createDustMeasurement,
    getDustMeasurementDataByDateRangeHandler,
} from '../controllers/dustMeasurementController';

const router = express.Router();

router.get('/', getDustMeasurements);  // For all measurements
router.get('/date-range', getDustMeasurementDataByDateRangeHandler); // For measurements by date range
router.post('/', createDustMeasurement); // To create new measurement

export default router;
