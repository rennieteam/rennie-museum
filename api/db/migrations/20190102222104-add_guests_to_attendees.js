'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Attendees',
      'guests',
      Sequelize.JSON
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Attendees',
      'guests'
    )
  }
};
