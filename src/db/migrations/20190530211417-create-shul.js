'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Shuls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nussach: {
        type: Sequelize.STRING,
        allowNull: false
      },
      childcare: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      femaleLeadership: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kaddishGeneral: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kaddishAlone: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Shuls');
  }
};
