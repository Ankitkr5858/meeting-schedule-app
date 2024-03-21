'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("meetings", "meeting_start", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("meetings", "meeting_end", {
      type: Sequelize.INTEGER,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("meetings", "meeting_start");
    await queryInterface.removeColumn("meetings", "meeting_end");
  }
};
