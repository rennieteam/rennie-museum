'use strict';

module.exports = (sequelize, DataTypes) => {

  const Attendee = sequelize.define('Attendee', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    guests: DataTypes.JSON,
    EventId: DataTypes.INTEGER
  });

  Attendee.associate = (models) => {
    Attendee.belongsTo(models.Event, {
      onDelete: "CASCADE",
      foreignKey: 'EventId'
    });
  };

  return Attendee;
};
