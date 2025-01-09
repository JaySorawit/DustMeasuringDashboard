import DustMeasurement from '../models/dustMeasurementModel';
import { Op, fn, col } from 'sequelize';

interface DustMeasurementInput {
    measurement_datetime: Date;
    room: string;
    location_name: string;
    count: number;
    um01: number;
    um03: number;
    um05: number;
    running_state: number;
    alarm_high: number;
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

// Fetch dust measurements between a given date range and multiple rooms
export const getDustMeasurementDataByDateRange = async (
    startDate: Date,
    endDate: Date,
    rooms: string[],
    dustTypes: number[]
) => {
    try {
        const whereClause: any = {
            measurement_datetime: {
                [Op.between]: [startDate, endDate],
            },
        };

        if (rooms.length > 0) {
            whereClause.room = {
                [Op.in]: rooms,
            };
        }

        if (dustTypes.length > 0) {
            whereClause.running_state = {
                [Op.in]: dustTypes,
            };
        }

        const measurements = await DustMeasurement.findAll({
            where: whereClause,
            attributes: [
                [fn('DISTINCT', col('location_name')), 'location_name']
            ],
            order: [['location_name', 'ASC']],
            raw: true,
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
                [fn('DISTINCT', col('location_name')), 'location_name'],
            ],
            order: [['location_name', 'ASC']],
            raw: true,
        });
        return locations.map(location => location.location_name);
    } catch (error) {
        throw new Error(`Error fetching dust measurement locations: ${(error as Error).message}`);
    }
};

// Create a new dust measurement data
export const createDustMeasurementData = async (data: Omit<DustMeasurementInput, 'measurement_id'>) => {
    try {
        const newMeasurement = await DustMeasurement.create(data);
        return newMeasurement;
    } catch (error) {
        console.error('Error creating dust measurement:', error);
        throw new Error(
            `Error creating dust measurement: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
};
