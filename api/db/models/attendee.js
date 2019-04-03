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
    Attendee.belongsTo(models.Event, {
      onDelete: "CASCADE",
      foreignKey: 'EventId',
      as: 'event'
    });

    Attendee.belongsTo(models.Designation, {
      foreignKey: 'DesignationId'
    })
  };
  
  return Attendee;
};
