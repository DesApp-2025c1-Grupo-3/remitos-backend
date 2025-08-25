'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TipoEmpresas', [
      {
        descripcion: 'Particular',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Empresa Privada',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Organismo Estatal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'ONG',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        descripcion: 'Cooperativa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TipoEmpresas', null, {});
  }
};
