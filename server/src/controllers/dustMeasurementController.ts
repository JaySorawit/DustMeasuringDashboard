import { Request, Response } from 'express';
import {
    getDustMeasurementData,
    createDustMeasurementData,
    getDustMeasurementDataByDateRange,
    getDustMeasurementLocation,
} from '../services/dustMeasurementService';

// Get all dust measurements
export const getDustMeasurementsHandler = async (req: Request, res: Response): Promise<void> => {
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
        const { startDate, endDate, rooms, areas, locations, dustTypes } = req.body;

        // Validate and parse dates
        if (!startDate || !endDate) {
            res.status(400).json({ message: 'Start date and end date are required.' });
            return;
        }

        if (startDate > endDate) {
            res.status(400).json({ message: 'Start date cannot be greater than end date.' });
            return;
        }

        // Parse dates directly
        const parsedStartDate = new Date(`${startDate}Z`);
        const parsedEndDate = new Date(`${endDate}Z`);   

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            res.status(400).json({ message: 'Invalid date format.' });
            return;
        }

        if (parsedStartDate > parsedEndDate) {
            res.status(400).json({ message: 'Start date cannot be greater than end date.' });
        }

        // Default to empty arrays if parameters are missing
        const roomsArray = rooms ?? [];
        const areaArray = areas ?? [];
        const locationArray = locations ?? [];
        const dustTypeArray = dustTypes ?? [];

        // Fetch all data in one call
        const measurements = await getDustMeasurementDataByDateRange(
            parsedStartDate,
            parsedEndDate,
            roomsArray,
            areaArray,
            locationArray,
            dustTypeArray
        );

        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: `Error fetching measurements: ${(error as Error).message}` });
    }
};

// Get dust measurement locations
export const getDustMeasurementLocationHandler = async (req: Request, res: Response): Promise<void> => {
    const rooms = req.query.rooms ? JSON.parse(req.query.rooms as string) : null;
    const areas = req.query.areas ? JSON.parse(req.query.areas as string) : null;
    
    try {
        const measurements = await getDustMeasurementLocation(rooms as string, areas as string);
        res.json(measurements);
    } catch (error) {
        console.error("Error in getDustMeasurementDataByDateRangeHandler:", error);
        res.status(500).json({ message: `Error fetching measurements: ${(error as Error).message}` });
    }
}

// Create new dust measurement
export const createDustMeasurementHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { measurement_datetime, room, location_name, count, um01, um03, um05, running_state, alarm_high, area } = req.body;

        const requiredFields = [
            { field: measurement_datetime, name: 'measurement_datetime' },
            { field: room, name: 'room' },
            { field: location_name, name: 'location_name' },
            { field: count, name: 'count' },
            { field: um01, name: 'um01' },
            { field: um03, name: 'um03' },
            { field: um05, name: 'um05' },
            { field: running_state, name: 'running_state' },
            { field: alarm_high, name: 'alarm_high' }
        ];

        const missingField = requiredFields.find(({ field }) => field === undefined || field === null);
        if (missingField) {
            res.status(400).json({ message: `Missing required field: ${missingField.name}` });
            return;
        }

        const newMeasurement = await createDustMeasurementData({
            measurement_datetime,
            room,
            area,
            location_name,
            count,
            um01,
            um03,
            um05,
            running_state,
            alarm_high
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
