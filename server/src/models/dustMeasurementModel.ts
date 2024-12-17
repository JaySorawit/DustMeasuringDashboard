import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface DustMeasurementAttributes {
    measurement_date: string;
    measurement_time: string;
    location_id: string;
    dust_value: number;
    dust_type: number;
}

type DustMeasurementCreationAttributes = Optional<DustMeasurementAttributes, 'dust_value'>;

class DustMeasurement extends Model<DustMeasurementAttributes, DustMeasurementCreationAttributes> implements DustMeasurementAttributes {
    public measurement_date!: string;
    public measurement_time!: string;
    public location_id!: string;
    public dust_value!: number;
    public dust_type!: number;
}

DustMeasurement.init(
    {
        measurement_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            primaryKey: true,
        },
        measurement_time: {
            type: DataTypes.TIME,
            allowNull: false,
            primaryKey: true,
        },
        location_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        dust_value: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dust_type: {
            type: DataTypes.FLOAT,
            allowNull: false,
            primaryKey: true,
        }
    },
    {
        sequelize,
        modelName: 'DustMeasurement',
        tableName: 'Dust_Measuring_Entity',  // Ensure the table name matches
        timestamps: false
    }
);

export default DustMeasurement;
