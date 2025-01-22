import RoomDustSafetyLimits, { RoomDustSafetyLimitAttributes } from '../models/roomDustSafetyLimitsModel';

interface RoomDustSafetyLimitInput extends Omit<RoomDustSafetyLimitAttributes, 'room'> {
    room: string;
}

export const createRoomDustSafetyLimit = async (data: RoomDustSafetyLimitInput) => {
    try {
        const newRoomLimit = await RoomDustSafetyLimits.create(data);
        return newRoomLimit;
    } catch (error) {
        throw new Error('Error creating room dust safety limit: ' + (error as Error).message);
    }
};

export const getAllRoomDustSafetyLimits = async () => {
    try {
        const roomLimits = await RoomDustSafetyLimits.findAll();
        return roomLimits;
    } catch (error) {
        throw new Error('Error fetching room dust safety limits: ' + (error as Error).message);
    }
};

export const getRoomDustSafetyLimitByRoom = async (room: string) => {
    try {
        const roomLimit = await RoomDustSafetyLimits.findOne({
            where: { room }
        });
        return roomLimit;
    } catch (error) {
        throw new Error('Error fetching room dust safety limit: ' + (error as Error).message);
    }
};

export const updateRoomDustSafetyLimit = async (room: string, data: RoomDustSafetyLimitInput) => {
    try {
        const roomLimit = await RoomDustSafetyLimits.findOne({ where: { room } });

        if (!roomLimit) {
            throw new Error('Room not found');
        }

        await roomLimit.update(data);
        return roomLimit;
    } catch (error) {
        throw new Error('Error updating room dust safety limit: ' + (error as Error).message);
    }
};

export const deleteRoomDustSafetyLimit = async (room: string) => {
    try {
        const deletedCount = await RoomDustSafetyLimits.destroy({
            where: { room }
        });

        if (deletedCount === 0) {
            throw new Error('Room not found');
        }

        return deletedCount;
    } catch (error) {
        throw new Error('Error deleting room dust safety limit: ' + (error as Error).message);
    }
};
