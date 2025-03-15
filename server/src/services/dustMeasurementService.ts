import DustMeasurement from '../models/dustMeasurementModel';
import { Op } from 'sequelize';

interface DustMeasurementInput {
    measurement_datetime: Date;
    room: string;
    area: string;
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
        const measurements = await DustMeasurement.findAll();
        return measurements;
    } catch (error) {
        throw new Error(`Error fetching dust measurements: ${(error as Error).message}`);
    }
};

// Fetch dust measurements between a given date range and multiple rooms
export const getDustMeasurementDataByDateRange = async (
    startDate: Date,
    endDate: Date,
    rooms: string[],
    areas: string[],
    locations: string[],
    dustTypes: number[]
) => {
    try {
        const whereClause: any = {
            measurement_datetime: {
                [Op.between]: [startDate, endDate],
            },
        };

        if (rooms && rooms.length > 0) {
            whereClause.room = {
                [Op.in]: rooms,
            };
        }

        if (areas && areas.length > 0) {
            whereClause.area = {
                [Op.in]: areas,
            };
        }

        if (locations && locations.length > 0) {
            whereClause.location_name = {
                [Op.in]: locations,
            };
        }

        const attributes = [
            'measurement_id',
            'measurement_datetime',
            'room',
            'area',
            'location_name',
            'count',
            'running_state',
            'alarm_high',
        ];

        if (dustTypes && dustTypes.length > 0) {
            if (dustTypes.includes(0.1)) attributes.push('um01');
            if (dustTypes.includes(0.3)) attributes.push('um03');
            if (dustTypes.includes(0.5)) attributes.push('um05');
        } else {
            attributes.push('um01', 'um03', 'um05');
        }

        const measurements = await DustMeasurement.findAll({
            where: whereClause,
            attributes,
            order: [['measurement_datetime', 'ASC'], ['room', 'ASC']],
            raw: true,
        });

        return measurements;
    } catch (error) {
        console.error("Error fetching dust measurements:", error);
        throw new Error(`Error fetching dust measurements: ${(error as Error).message}`);
    }
};

// Fetch dust measurement locations
export const getDustMeasurementLocation = async (rooms?: string, areas?: string) => {
    const whereClause: {
        room?: { [Op.in]: string[] };
        area?: { [Op.in]: string[] };
    } = {};

    if (rooms) {
        whereClause.room = { [Op.in]: JSON.parse(rooms) };
    }

    if (areas) {
        whereClause.area = { [Op.in]: JSON.parse(areas) };
    }

    try {
        const locations = await DustMeasurement.findAll({
            attributes: ['room', 'area', 'location_name'],
            where: whereClause,
            group: ['room', 'area', 'location_name'],
            order: [['room', 'ASC'], ['area', 'ASC'], ['location_name', 'ASC']],
            raw: true,
        });

        return locations;
    } catch (error) {
        console.error("Error fetching dust measurements:", error);
        throw new Error(`Error fetching dust measurement locations: ${(error as Error).message}`);
    }
};

// Create a new dust measurement data
export const createDustMeasurementData = async (data: Omit<DustMeasurementInput, 'measurement_id'>) => {
    try {
        console.log('Data to insert:', data);  // ตรวจสอบค่าที่ถูกส่ง
        const newMeasurement = await DustMeasurement.create(data);
        return newMeasurement;
    } catch (error) {
        console.error('Error creating dust measurement:', error);
        throw new Error(
            `Error creating dust measurement: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
};
