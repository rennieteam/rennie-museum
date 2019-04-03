'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AttendeeDesignations', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AttendeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Attendees',
          key: 'id'
        },
      },
      DesignationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Designations',
          key: 'id'
        },
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AttendeeDesignations');
  }
};
