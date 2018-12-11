'use strict';
module.exports = (sequelize, DataTypes) => {

  const Event = sequelize.define('Event', {
    externalId: DataTypes.INTEGER,
    externalSlug: DataTypes.STRING,
    date: DataTypes.DATE,
    numberOfAttendees: DataTypes.INTEGER
  }, {});

  Event.associate = function(models) {
    // associations can be defined here
  };

  return Event;
};
