'use strict';
module.exports = (sequelize, DataTypes) => {

  const EventType = sequelize.define('EventType', {
    name: DataTypes.STRING,
    default: DataTypes.BOOLEAN
  });

  return EventType;
};