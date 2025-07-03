"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Contactos", "telefono", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Note: This might fail if you have values that don't fit in an integer.
    await queryInterface.changeColumn("Contactos", "telefono", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
