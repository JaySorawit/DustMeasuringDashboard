import DustMeasurement from '../models/dustMeasurementModel';
import { Op, fn, col } from 'sequelize';

interface DustMeasurementInput {
    id?: number;
    measurement_datetime: Date;
    location_id: string;
    dust_value: number;
    dust_type: number;
}

// Fetch all dust measurements
export const getDustMeasurementData = async () => {
    try {
        // Use the DustMeasurement model's `findAll()` to fetch all records
        const measurements = await DustMeasurement.findAll();
        return measurements; // Return the measurements as an array of model instances
    } catch (error) {
        throw new Error(`Error fetching dust measurements: ${(error as Error).message}`);
    }
};

// Fetch dust measurements between a given date range
export const getDustMeasurementDataByDateRange = async (startDate: Date, endDate: Date) => {
    try {
        const measurements = await DustMeasurement.findAll({
            where: {
                measurement_datetime: {
                    [Op.between]: [startDate, endDate],
                }
            }
        });
        return measurements;
    } catch (error) {
        throw new Error(`Error fetching dust measurements: ${(error as Error).message}`);
    }
};

// Fetch dust measurement locations
export const getDustMeasurementLocation = async () => {
    try {
        const locations = await DustMeasurement.findAll({
            attributes: [
                [fn('DISTINCT', col('location_id')), 'location_id']
            ],
            order: [['location_id', 'ASC']],
            raw: true,
        });
        return locations.map(location => location.location_id);
    } catch (error) {
        throw new Error(`Error fetching dust measurement locations: ${(error as Error).message}`);
    }
};

// Create a new dust measurement data
export const createDustMeasurementData = async (data: DustMeasurementInput) => {
    try {
        const newMeasurement = await DustMeasurement.create(data);
        return newMeasurement;
    } catch (error) {
        throw new Error(`Error creating dust measurement: ${(error as Error).message}`);
    }
};
