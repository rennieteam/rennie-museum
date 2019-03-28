'use strict';

let designations = [
  {name: 'General'},
  {name: 'Student'},
  {name: 'Artist'},
  {name: 'Collector'},
  {name: 'Art Professional'}
];

const db = require('../models/index');
const Designation = db.Designation;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Designation.bulkCreate(designations);
  },

  down: (queryInterface, Sequelize) => {
    return Designation.destroy({where: {}})
  }
};
