'use strict';

module.exports = (sequelize, DataTypes) => {

  const Attendee = sequelize.define('Attendee', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    guests: DataTypes.JSON,
    EventId: DataTypes.INTEGER,
    hash: DataTypes.STRING,
    overrideCount: DataTypes.BOOLEAN,
    adminAdded: DataTypes.BOOLEAN,
    DesignationId: DataTypes.INTEGER
  });

  Attendee.associate = (models) => {
    Attendee.hasOne(models.Designation, {
      foreignKey: 'DesignationId',
      as: 'designation'
    });
  };
  
  Attendee.associate = (models) => {
    Attendee.belongsTo(models.Event, {
      onDelete: "CASCADE",
      foreignKey: 'EventId',
      as: 'event'
    });
  };
  
  
  return Attendee;
};
