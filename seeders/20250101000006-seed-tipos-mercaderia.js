'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TipoMercaderias', [
      {
        nombre: 'Automotriz',
        descripcion: 'Productos relacionados con la industria automotriz',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Amoblamientos',
        descripcion: 'Muebles y elementos de decoración',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Alimentos',
        descripcion: 'Productos alimenticios y bebidas',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Textil',
        descripcion: 'Telas, ropa y productos textiles',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Materiales Construcción',
        descripcion: 'Materiales para construcción y obra',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Electrónica',
        descripcion: 'Dispositivos y componentes electrónicos',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Químicos',
        descripcion: 'Productos químicos y farmacéuticos',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Otros',
        descripcion: 'Otros tipos de mercadería',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TipoMercaderias', null, {});
  }
};
