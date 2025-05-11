"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Remitos", "estadoId", {
      type: Sequelize.INTEGER,
      allowNull: true, // para evitar el error
      references: {
        model: "Estados",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Remitos", "estadoId");
  },
};
