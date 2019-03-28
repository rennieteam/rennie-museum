'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Attendees',
      'DesignationId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Designations',
          key: 'id'
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Attendees',
      'DesignationId'
    )
  }
};
