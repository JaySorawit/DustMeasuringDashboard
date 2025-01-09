import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface RoomDustSafetyLimitAttributes {
    room: string;
    usl01: number | null;
    usl03: number | null;
    usl05: number | null;
    ucl01: number | null;
    ucl03: number | null;
    ucl05: number | null;
}

class RoomDustSafetyLimits extends Model<RoomDustSafetyLimitAttributes> implements RoomDustSafetyLimitAttributes {
    public room!: string;
    public usl01!: number | null;
    public usl03!: number | null;
    public usl05!: number | null;
    public ucl01!: number | null;
    public ucl03!: number | null;
    public ucl05!: number | null;
}

RoomDustSafetyLimits.init(
    {
        room: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        usl01: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        usl03: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        usl05: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ucl01: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ucl03: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ucl05: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },        
    },
    {
        sequelize,
        modelName: 'RoomDustSafetyLimits',
        tableName: 'RoomDustSafetyLimits',
        timestamps: false,
    }
);

export default RoomDustSafetyLimits;
