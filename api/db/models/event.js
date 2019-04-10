'use strict';
module.exports = (sequelize, DataTypes) => {

  const Event = sequelize.define('Event', {
    externalId: DataTypes.INTEGER,
    externalSlug: DataTypes.STRING,
    date: DataTypes.DATE,
    numberOfAttendees: DataTypes.INTEGER,
    published: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    location: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING,
    config: DataTypes.JSON,
    host: DataTypes.STRING,
    contact: DataTypes.STRING,
    EventTypeId: DataTypes.INTEGER
  });

  Event.associate = (models) => {
    Event.hasMany(models.Attendee, {
      foreignKey: 'EventId',
      as:'attendees'
    });
  };

  return Event;
};