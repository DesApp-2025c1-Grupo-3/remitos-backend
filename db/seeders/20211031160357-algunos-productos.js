'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // acá cambiar el nombre de la tabla
    await queryInterface.bulkInsert('ProductoHecho', [
      // los registros a agregar
      {
        codigo: 'AFX82',
        nombre: 'Agua oxigenada',
        precio: 350,
        proveedor: 'Chino de la vuelta',
        // esto hay que ponerlo en cada registro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        codigo: 'JPX04',
        nombre: 'Nitrato de amonio',
        precio: 225,
        proveedor: 'Química Acme',
        // esto hay que ponerlo en cada registro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        codigo: 'ROA99',
        nombre: 'Extractor de ADN alienígeno',
        precio: 84000,
        proveedor: 'Ben 10',
        // esto hay que ponerlo en cada registro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        codigo: 'PPQ342',
        nombre: 'Tiras indicadoras de PH',
        precio: 7200,
        proveedor: 'OneLab',
        // esto hay que ponerlo en cada registro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // acá cambiar el nombre de la tabla
    await queryInterface.bulkDelete('ProductoHecho', null, {});
  },
};
