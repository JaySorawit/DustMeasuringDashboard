// src/controllers/dustMeasurementController.ts
import { Request, Response } from 'express';
import DustMeasurement from '../models/dustMeasurementModel';

// Get all dust measurements
export const getDustMeasurements = async (req: Request, res: Response) => {
    try {
        const measurements = await DustMeasurement.findAll();  // Fetch data from DB
        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching measurements', error });
    }
};

// Create a new dust measurement
export const createDustMeasurement = async (req: Request, res: Response) => {
    try {
        const { measurement_date, measurement_time, location_id, dust_value, dust_type } = req.body;
        const newMeasurement = await DustMeasurement.create({
            measurement_date,
            measurement_time,
            location_id,
            dust_value,
            dust_type,
        });
        res.status(201).json(newMeasurement);
    } catch (error) {
        res.status(500).json({ message: 'Error creating measurement', error });
    }
};
