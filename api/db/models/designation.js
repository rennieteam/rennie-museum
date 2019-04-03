'use strict';

module.exports = (sequelize, DataTypes) => {

  const Designation = sequelize.define('Designation', {
    name: DataTypes.STRING,
  });

  Designation.associate = (models) => {
    Designation.belongsToMany(models.Attendee, { through: models.AttendeeDesignation });
  };

  return Designation;
};
