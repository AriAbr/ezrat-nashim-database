'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1, 2, 3, 4]]
        }
      },
      avgAudVisRating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sameFloorCentered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      sameFloorSide: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      sameFloorBack: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      elevatedCentered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      elevatedSide: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      elevatedBack: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      balconySide: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      balconyBack: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      noWomenSection: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      shulId: {
         type: Sequelize.INTEGER,
         onDelete: "CASCADE",
         allowNull: false,
         references: {
           model: "Shuls",
           key: "id",
           as: "shulId"
         },
       }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Rooms');
  }
};
