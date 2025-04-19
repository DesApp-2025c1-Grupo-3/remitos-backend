'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Producto', [
      {
        codigo: 'PIL34',
        nombre: 'Pilas triple A',
        precio: 180,
        proveedor: 'Kiosco El Toto',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        codigo: 'ALC96',
        nombre: 'Alcohol 96%',
        precio: 450,
        proveedor: 'Farmacia Tesei',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        codigo: 'NIT84',
        nombre: 'Nitrato de Amonio',
        precio: 800,
        proveedor: 'Droguería Sumo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Producto', null, {});
  }
};
