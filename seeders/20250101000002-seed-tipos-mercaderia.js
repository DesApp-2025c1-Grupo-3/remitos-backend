'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TipoMercaderias', [
      {
        descripcion: 'Automotriz',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Amoblamientos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Alimentos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Textil',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Materiales Construcción',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Electrónica',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Químicos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Otros',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TipoMercaderias', null, {});
  }
};
