'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Events', 'name'),
      queryInterface.removeColumn('Events', 'startTime'),
      queryInterface.removeColumn('Events', 'endTime'),
      queryInterface.removeColumn('Events', 'location'),
      queryInterface.removeColumn('Events', 'description'),
      queryInterface.removeColumn('Events', 'url'),
      queryInterface.removeColumn('Events', 'config'),
      queryInterface.removeColumn('Events', 'host'),
      queryInterface.removeColumn('Events', 'contact'),
      queryInterface.removeColumn('Events', 'EventTypeId')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Events',
        'name',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'startTime',
        {
          type: Sequelize.TIME,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'endTime',
        {
          type: Sequelize.TIME,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'location',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'description',
        {
          type: Sequelize.TEXT,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'url',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'config',
        {
          type: Sequelize.JSON,
          defaultValue: {},
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'Events',
        'host',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'contact',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'Events',
        'EventTypeId',
        {
          type: Sequelize.INTEGER,
        }
      )
    ])
  }
};
