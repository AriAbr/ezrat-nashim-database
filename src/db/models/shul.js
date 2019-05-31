'use strict';
module.exports = (sequelize, DataTypes) => {
  var Shul = sequelize.define('Shul', {
    cityId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    nussach: {
      type: DataTypes.STRING,
      allowNull:false
    },
    childcare: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    femaleLeadership: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    kaddishGeneral: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    kaddishAlone: {
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {});
  Shul.associate = function(models) {
    // associations can be defined here
    Shul.hasMany(models.Room, {
      foreignKey: "shulId",
      as: "rooms"
    })
  };
  return Shul;
};
