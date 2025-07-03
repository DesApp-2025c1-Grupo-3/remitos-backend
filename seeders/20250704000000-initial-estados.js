"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Estados",
      [
        {
          nombre: "Ingresado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "En curso",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Entregado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Cancelado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Estados", null, {});
  },
};
