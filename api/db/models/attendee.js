'use strict';
// const Event = require('./event');

module.exports = (sequelize, DataTypes) => {

  const Attendee = sequelize.define('Attendee', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    guests: DataTypes.JSON
  }, {});


  // Attendee.associate = function(models) {
  //   Attendee.belongsTo(models.Event, {
  //     foreignKey: 'event_id'
  //   });
  // };

  // Attendee.belongsTo(Event, { foreignKey: 'event_id' });

  return Attendee;
};
