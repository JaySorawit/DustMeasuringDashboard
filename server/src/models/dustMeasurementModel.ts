// dustMeasurement.ts (Sequelize model)
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
            allowNull: false
        },
        measurement_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        location_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dust_value: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dust_type: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'DustMeasurement',
        tableName: 'dust_measurements',
        timestamps: false
    }
);

export default DustMeasurement;
