import DustMeasurement from '../models/dustMeasurementModel';

interface DustMeasurementInput {
    measurement_date: string;
    measurement_time: string;
    location_id: string;
    dust_value: number;
    dust_type: number;
}

export const getDustMeasurementData = async () => {
    try {
        return await DustMeasurement.findAll();
    } catch (error) {
        throw new Error(`Error fetching dust measurements: ${(error as Error).message}`);
    }
};

export const createDustMeasurementData = async (data: DustMeasurementInput) => {
    try {
        return await DustMeasurement.create(data);
    } catch (error) {
        throw new Error(`Error creating dust measurement: ${(error as Error).message}`);
    }
};

