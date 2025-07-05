"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Estados",
      [
        {
          nombre: "Autorizado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "En preparación",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "En carga",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "En camino",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Entregado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "No entregado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Retenido",
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
