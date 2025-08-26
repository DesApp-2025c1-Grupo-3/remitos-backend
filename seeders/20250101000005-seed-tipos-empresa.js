'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TipoEmpresas', [
      {
        nombre: 'Particular',
        descripcion: 'Persona física o particular',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Empresa privada',
        descripcion: 'Empresa del sector privado',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Organismo estatal',
        descripcion: 'Entidad gubernamental o estatal',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TipoEmpresas', null, {});
  }
};
