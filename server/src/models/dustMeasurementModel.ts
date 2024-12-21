import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database'; // Import the Sequelize instance

interface DustMeasurementAttributes {
    id: number;
    measurement_datetime: Date;
    location_id: string;
    dust_value: number;
    dust_type: number;
}

type DustMeasurementCreationAttributes = Optional<DustMeasurementAttributes, 'id'>;

class DustMeasurement extends Model<DustMeasurementAttributes, DustMeasurementCreationAttributes> implements DustMeasurementAttributes {
    public id!: number;
    public measurement_datetime!: Date;
    public location_id!: string;
    public dust_value!: number;
    public dust_type!: number;
}

DustMeasurement.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        measurement_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dust_value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dust_type: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'DustMeasurement',
        tableName: 'Dust_Measuring_Entity', // Ensure this matches the actual table name in your DB
        timestamps: false, // Disable timestamps as your table doesn't use them
    }
);

export default DustMeasurement;
