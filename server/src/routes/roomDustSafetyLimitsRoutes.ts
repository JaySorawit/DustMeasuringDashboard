import express from 'express';
import {
    getAllRoomDustSafetyLimitsHandler,
    updateRoomDustSafetyLimitHandler,
    deleteRoomDustSafetyLimitHandler,
    createRoomDustSafetyLimitHandler,
} from '../controllers/roomDustSafetyLimitsController';

const router = express.Router();

router.post('/', createRoomDustSafetyLimitHandler);
router.get('/', getAllRoomDustSafetyLimitsHandler);
router.put('/:room', updateRoomDustSafetyLimitHandler);
router.delete('/:room', deleteRoomDustSafetyLimitHandler);


export default router;