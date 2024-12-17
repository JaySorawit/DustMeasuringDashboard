import { RequestHandler } from 'express';
import { getDustMeasurementData, createDustMeasurementData } from '../services/dustMeasurementService';

// Get all dust measurements
export const getDustMeasurements: RequestHandler = async (_, res) => {
    try {
        const measurements = await getDustMeasurementData();
        res.status(200).json(measurements);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching measurements', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

// Create a new dust measurement
export const createDustMeasurement: RequestHandler = async (req, res) => {
    try {
        const { measurement_date, measurement_time, location_id, dust_value, dust_type } = req.body;

        // Validate request body
        if (!measurement_date || !measurement_time || !location_id || dust_value == null || dust_type == null) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const newMeasurement = await createDustMeasurementData({
            measurement_date,
            measurement_time,
            location_id,
            dust_value,
            dust_type,
        });

        res.status(201).json(newMeasurement);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error creating measurement', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
