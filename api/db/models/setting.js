'use strict';

module.exports = (sequelize, DataTypes) => {

  const Setting = sequelize.define('Setting', {
    name: DataTypes.STRING,
    value: DataTypes.BOOLEAN,
    isToggle: DataTypes.BOOLEAN,
    content: DataTypes.STRING
  });
  
  return Setting;
};
