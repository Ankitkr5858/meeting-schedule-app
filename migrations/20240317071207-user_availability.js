'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_availability', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      available_day_start: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      available_day_end: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      buffer_time: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      available_time_start: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      available_time_end: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      max_meetings: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_availability');
  }

};
