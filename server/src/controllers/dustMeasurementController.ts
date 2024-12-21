import { Request, Response } from 'express';
import {
    getDustMeasurementData,
    createDustMeasurementData,
    getDustMeasurementDataByDateRange,
} from '../services/dustMeasurementService';

// Get all dust measurements
export const getDustMeasurements = async (req: Request, res: Response): Promise<void> => {
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

// Get dust measurements by date range
export const getDustMeasurementDataByDateRangeHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            res.status(400).json({ message: 'Start date and end date are required.' });
            return;
        }

        const parsedStartDate = new Date(startDate as string);
        const parsedEndDate = new Date(endDate as string);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            res.status(400).json({ message: 'Invalid date format.' });
            return;
        }

        const measurements = await getDustMeasurementDataByDateRange(parsedStartDate, parsedEndDate);
        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: `Error fetching measurements: ${(error as Error).message}` });
    }
};


// Create new dust measurement
export const createDustMeasurement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { measurement_datetime, location_id, dust_value, dust_type } = req.body;

        if (!measurement_datetime || !location_id || dust_value == null || dust_type == null) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const newMeasurement = await createDustMeasurementData({
            measurement_datetime,
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
