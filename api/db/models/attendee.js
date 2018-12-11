'use strict';
module.exports = (sequelize, DataTypes) => {

  const Attendee = sequelize.define('Attendee', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    event_id: DataTypes.INTEGER
  }, {});

  Attendee.associate = function(models) {
    // associations can be defined here
  };

  return Attendee;
};
