'use strict';

module.exports = (sequelize, DataTypes) => {

  const Designation = sequelize.define('Designation', {
    name: DataTypes.STRING,
  });

  Designation.associate = (models) => {
    Designation.hasMany(models.Attendee, {
      foreignKey: 'DesignationId',
      as:'designation'
    });
  };

  return Designation;
};
