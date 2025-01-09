import { Request, Response } from 'express';
import {
    createRoomDustSafetyLimit,
    getAllRoomDustSafetyLimits,
    getRoomDustSafetyLimitByRoom,
    updateRoomDustSafetyLimit,
    deleteRoomDustSafetyLimit,
} from '../services/roomDustSafetyLimitService';

export const createRoomDustSafetyLimitHandler = async (req: Request, res: Response) => {
    const { room, usl01, usl03, usl05, ucl01, ucl03, ucl05 } = req.body;
    try {
        const roomLimit = await createRoomDustSafetyLimit({
            room, usl01, usl03, usl05, ucl01, ucl03, ucl05
        });
        res.status(201).json({
            success: true,
            message: 'Room dust safety limit created successfully',
            data: roomLimit,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const getAllRoomDustSafetyLimitsHandler = async (req: Request, res: Response) => {
    try {
        const roomLimits = await getAllRoomDustSafetyLimits();
        res.status(200).json({
            success: true,
            data: roomLimits,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const getRoomDustSafetyLimitByRoomHandler = async (req: Request, res: Response) => {
    try {
        const roomLimit = await getRoomDustSafetyLimitByRoom(req.params.room);
        if (!roomLimit) {
            return res.status(404).json({
                success: false,
                message: 'Room not found',
            });
        }
        res.status(200).json({
            success: true,
            data: roomLimit,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const updateRoomDustSafetyLimitHandler = async (req: Request, res: Response) => {
    try {
        const updatedRoomLimit = await updateRoomDustSafetyLimit(req.params.room, req.body);
        res.status(200).json({
            success: true,
            message: 'Room dust safety limit updated successfully',
            data: updatedRoomLimit,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const deleteRoomDustSafetyLimitHandler = async (req: Request, res: Response) => {
    try {
        await deleteRoomDustSafetyLimit(req.params.room);
        res.status(200).json({
            success: true,
            message: 'Room dust safety limit deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
};
