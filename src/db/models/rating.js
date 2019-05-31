'use strict';
module.exports = (sequelize, DataTypes) => {
  var Rating = sequelize.define('Rating', {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3, 4, 5]]
      }
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Rating.associate = function(models) {
    // associations can be defined here

    Rating.belongsTo(models.Room, {
      foreignKey: "roomId",
      onDelete: "CASCADE"
    });

    Rating.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    
  };
  return Rating;
};
