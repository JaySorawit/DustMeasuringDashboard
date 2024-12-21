import DustMeasurement from '../models/dustMeasurementModel';
import { Op } from 'sequelize';

interface DustMeasurementInput {
    id?: number; // id is optional for creation as it's auto-incremented
    measurement_datetime: Date;
    location_id: string;
    dust_value: number;
    dust_type: number;
}

// Fetch all dust measurements using ORM's `findAll` method
export const getDustMeasurementData = async () => {
    try {
        // Use the DustMeasurement model's `findAll()` to fetch all records
        const measurements = await DustMeasurement.findAll();
        return measurements; // Return the measurements as an array of model instances
    } catch (error) {
        throw new Error(`Error fetching dust measurements: ${(error as Error).message}`);
    }
};

// Fetch dust measurements between a given date range using ORM
export const getDustMeasurementDataByDateRange = async (startDate: Date, endDate: Date) => {
    try {
        // Use Sequelize's `findAll` method with the `where` clause for date filtering
        const measurements = await DustMeasurement.findAll({
            where: {
                measurement_datetime: {
                    [Op.between]: [startDate, endDate], // Filter between startDate and endDate
                }
            }
        });
        return measurements; // Return the measurements as an array of model instances
    } catch (error) {
        throw new Error(`Error fetching dust measurements: ${(error as Error).message}`);
    }
};

// Create a new dust measurement data using ORM's `create` method
export const createDustMeasurementData = async (data: DustMeasurementInput) => {
    try {
        // Use the DustMeasurement model's `create()` method to insert a new record
        const newMeasurement = await DustMeasurement.create(data);
        return newMeasurement; // Return the newly created record
    } catch (error) {
        throw new Error(`Error creating dust measurement: ${(error as Error).message}`);
    }
};
