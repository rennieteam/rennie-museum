'use strict';
module.exports = (sequelize, DataTypes) => {

  const Event = sequelize.define('Event', {
    externalId: DataTypes.INTEGER,
    externalSlug: DataTypes.STRING,
    date: DataTypes.DATE,
    numberOfAttendees: DataTypes.INTEGER,
    published: DataTypes.BOOLEAN
  });

  Event.associate = (models) => {
    Event.hasMany(models.Attendee, {
      foreignKey: 'EventId',
      as:'attendees'
    });
  };

  return Event;
};