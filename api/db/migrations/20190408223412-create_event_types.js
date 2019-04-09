'use strict';

let types = [
  {name: 'Tour'},
  {name: 'Lunch & Learn'},
  {name: 'Rennie Coffee'},
  {name: 'Other'}
];

const db = require('../models/index');
const EventType = db.EventType;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return EventType.bulkCreate(types);
  },

  down: (queryInterface, Sequelize) => {
    return EventType.destroy({where: {}})
  }
};
