'use strict';

let types = [
  {name: 'tour', default: true},
  {name: 'lunch & learn', default: true},
  {name: 'rennie coffee', default: true},
  {name: 'other', default: true}
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
