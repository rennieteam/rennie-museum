'use strict';

module.exports = (sequelize, DataTypes) => {

  const AttendeeDesignation = sequelize.define('AttendeeDesignation', {
    DesignationId: DataTypes.INTEGER,
    AttendeeId: DataTypes.INTEGER
  });

  return AttendeeDesignation;
};
