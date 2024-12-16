// dustMeasurementRoutes.ts
import express from 'express';
import { getDustMeasurements } from '../controllers/dustMeasurementController';

const router = express.Router();

router.get('/', getDustMeasurements);

export default router;
