import express from 'express';
import { getDustMeasurements, createDustMeasurement } from '../controllers/dustMeasurementController';

const router = express.Router();

router.get('/', getDustMeasurements);
router.post('/', createDustMeasurement);

export default router;
