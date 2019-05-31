'use strict';
module.exports = (sequelize, DataTypes) => {
  var Room = sequelize.define('Room', {
    roomName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1, 2, 3, 4]]
      }
    },
    avgAudVisRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    sameFloorCentered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sameFloorSide: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sameFloorBack: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    elevatedCentered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    elevatedSide: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    elevatedBack: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    balconySide: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    balconyBack: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    noWomenSection: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    shulId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
    Room.belongsTo(models.Shul, {
      foreignKey: "shulId",
      onDelete: "CASCADE"
    });

    Room.hasMany(models.Rating, {
      foreignKey: "roomId",
      as: "ratings"
    })
  };
  return Room;
};
