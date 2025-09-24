'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar el estado "Agendado" a la tabla Estados
    await queryInterface.bulkInsert('Estados', [
      {
        nombre: 'Agendado',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar el estado "Agendado"
    await queryInterface.bulkDelete('Estados', {
      nombre: 'Agendado'
    }, {});
  }
};

