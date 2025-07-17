"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si la columna ya existe
    const tableDescription = await queryInterface.describeTable("Remitos");
    if (!tableDescription.razonNoEntrega) {
      await queryInterface.addColumn("Remitos", "razonNoEntrega", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("Remitos");
    if (tableDescription.razonNoEntrega) {
      await queryInterface.removeColumn("Remitos", "razonNoEntrega");
    }
  },
};
