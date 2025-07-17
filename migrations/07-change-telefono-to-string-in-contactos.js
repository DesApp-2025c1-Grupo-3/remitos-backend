"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Contactos", "telefono", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Contactos", "telefono", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
