'use strict';
import {
    Model
} from 'sequelize';
const createUserAvailabilityModel = (sequelize, DataTypes) => {
    /**
   * @extends {Model<import('../src/types/user').IUserAvailabilityResponse, any>}
   * @implements {import('../src/types/user').IUserAvailabilityResponse}
   */
    class UserAvailability extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserAvailability.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: DataTypes.INTEGER,
        available_day_start: DataTypes.INTEGER,
        available_day_end: DataTypes.INTEGER,
        available_time_start: DataTypes.INTEGER,
        available_time_end: DataTypes.INTEGER,
        max_meetings: DataTypes.INTEGER,
        buffer_time: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'user_availability',
        tableName: 'user_availability',
    });

    return UserAvailability;

};
export default createUserAvailabilityModel