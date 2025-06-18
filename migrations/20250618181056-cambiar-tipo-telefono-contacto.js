"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Contactos", "telefono", {
      type: Sequelize.STRING,
      allowNull: true, // o false si es obligatorio
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Contactos", "telefono", {
      type: Sequelize.INTEGER,
      allowNull: true, // o false, lo que tengas originalmente
    });
  },
};
