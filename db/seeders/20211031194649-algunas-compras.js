'use strict';

// me inspiré en 
// https://stackoverflow.com/questions/45286429/custom-query-on-sequelize-seeder
// cambiando la notación de Promise a async/await

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const product1Data = await queryInterface.sequelize.query(
      `SELECT id FROM "ProductoHecho" WHERE codigo = 'AFX82' `, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });
    const product1Id = product1Data[0].id;

    const product2Data = await queryInterface.sequelize.query(
      `SELECT id FROM "ProductoHecho" WHERE codigo = 'JPX04' `, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });
    const product2Id = product2Data[0].id;

    // acá cambiar el nombre de la tabla
    await queryInterface.bulkInsert('CompraHecho', [
      // los registros a agregar
      {
        proveedor: 'Chino de la vuelta',
        fecha: '2021-10-15',
        precio: 350,
        cantidad: 5,
        ProductoHechoId: product1Id,
        // esto hay que ponerlo en cada registro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        proveedor: 'Farmacia Tesei',
        fecha: '2021-10-24',
        precio: 312,
        cantidad: 2,
        ProductoHechoId: product1Id,
        // esto hay que ponerlo en cada registro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        proveedor: 'Química Arce',
        fecha: '2021-10-21',
        precio: 200,
        cantidad: 9,
        ProductoHechoId: product2Id,
        // esto hay que ponerlo en cada registro
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    // acá cambiar el nombre de la tabla
    await queryInterface.bulkDelete('CompraHecho', null, {});
  }
};
