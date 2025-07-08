"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("TipoMercaderia", [
      { nombre: "Electrónica", createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Frágil", createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Materia Prima", createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Textil", createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Amoblamientos", createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Otros", createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TipoMercaderia", null, {});
  }
}; 