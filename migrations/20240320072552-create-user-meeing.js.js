'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MeetingUserRelationship', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      target_user_id: Sequelize.INTEGER,
      source_user_id: Sequelize.INTEGER,
      meeting_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Meetings',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MeetingUserRelationship');
  }
};
