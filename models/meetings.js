import { Model } from 'sequelize';

const createMeetingsModel = (sequelize, DataTypes) => {
  /**
 * @extends {Model<import('../src/types/meeting').IMeetingRecords, any>}
 * @implements {import('../src/types/meeting').IMeetingRecords}
 */
  class Meetings extends Model {
    static associate(models) {
      Meetings.hasMany(models.UserMeetingRelationship, { foreignKey: 'meeting_id' });
    }
  }

  Meetings.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    meeting_start: DataTypes.INTEGER,
    meeting_end: DataTypes.INTEGER,
    meeting_day: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'meetings',
  });

  return Meetings;
};

export default createMeetingsModel;
