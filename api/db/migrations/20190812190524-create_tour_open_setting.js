'use strict';

const db = require('../models/index');
const Setting = db.Setting;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Setting.bulkCreate([
      {name: 'tours open', isToggle: true, value: true},
      {name: 'tours closed message', isToggle: false, content: 'tours closed.', value: true}
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Setting.destroy({where: {}})
  }
};
