
import { Model } from 'sequelize';

const createUserMeetingRelationshipModel = (sequelize, DataTypes) => {
    /**
   * @extends {Model<import('../src/types/user').IUserMeeting, any>}
   * @implements {import('../src/types/user').IUserMeeting}
   */
  class UserMeetingRelationship extends Model {
    static associate(models) {
      UserMeetingRelationship.belongsTo(models.Meetings, { foreignKey: 'meeting_id' });
    }
  }

  UserMeetingRelationship.init({
    target_user_id: DataTypes.INTEGER,
    source_user_id: DataTypes.INTEGER,
    meeting_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Meetings',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'MeetingUserRelationship',
    tableName: 'MeetingUserRelationship',
  });

  return UserMeetingRelationship;
};

export default createUserMeetingRelationshipModel;
