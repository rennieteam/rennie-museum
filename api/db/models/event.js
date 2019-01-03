'use strict';
const Attendee = require('./attendee');

const Sequelize = require('sequelize');

// console.log(Attendee);

module.exports = (sequelize, DataTypes) => {

  const Event = sequelize.define('Event', {
    externalId: DataTypes.INTEGER,
    externalSlug: DataTypes.STRING,
    date: DataTypes.DATE,
    numberOfAttendees: DataTypes.INTEGER
  }, {});


  // Event.associate = function(models) {
  //   Event.hasMany(models.Attendee, {
  //     foreignKey: 'event_id',
  //     as: 'attendees'
  //   });
  // };

  console.log(Attendee);
  Event.hasMany(Sequelize.model('Attendee'), { as: 'attendees', foreignKey: 'event_id' });
  Attendee.belongsTo(Event, { foreignKey: 'event_id' });

  return Event;
};
