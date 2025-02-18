import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database'; // Import the Sequelize instance

interface DustMeasurementAttributes {
    measurement_id: number;
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

type DustMeasurementCreationAttributes = Optional<DustMeasurementAttributes, 'measurement_id'>;

class DustMeasurement extends Model<DustMeasurementAttributes, DustMeasurementCreationAttributes> implements DustMeasurementAttributes {
    public measurement_id!: number;
    public measurement_datetime!: Date;
    public room!: string;
    public area!: string;
    public location_name!: string;
    public count!: number;
    public um01!: number;
    public um03!: number;
    public um05!: number;
    public running_state!: number;
    public alarm_high!: number;

    public static associate(models: any) {
        DustMeasurement.belongsTo(models.RoomDustSafetyLimits, {
            foreignKey: 'room',
            targetKey: 'room',
            as: 'RoomData'
        });

        DustMeasurement.belongsTo(models.RoomDustSafetyLimits, {
            foreignKey: 'area',
            targetKey: 'area',
            as: 'AreaData'
        });
    }
}

DustMeasurement.init(
    {
        measurement_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        measurement_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        room: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: 'RoomDustSafetyLimits',
                key: 'room',
            },
        },
        area: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: 'RoomDustSafetyLimits',
                key: 'area',
            },
        },
        location_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        um01: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        um03: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        um05: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        running_state: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        alarm_high: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'DustMeasurement',
        tableName: 'DustMeasurements',
        timestamps: false,
    }
);

export default DustMeasurement;
