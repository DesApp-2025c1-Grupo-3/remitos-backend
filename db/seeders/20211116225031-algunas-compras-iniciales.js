'use strict';

// me inspiré en 
// https://stackoverflow.com/questions/45286429/custom-query-on-sequelize-seeder
// cambiando la notación de Promise a async/await

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const product1Data = await queryInterface.sequelize.query(
      `SELECT id FROM "Producto" WHERE codigo = 'PIL34' `, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });
    const idPilas = product1Data[0].id;

    const product2Data = await queryInterface.sequelize.query(
      `SELECT id FROM "Producto" WHERE codigo = 'ALC96' `, {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });
    const idAlcohol = product2Data[0].id;

    await queryInterface.bulkInsert('Compra', [
      {
        proveedor: 'Mercado Central',
        fecha: '2021-08-23',
        precio: 190,
        cantidad: 3,
        ProductoId: idPilas,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        proveedor: 'Mercado Lateral',
        fecha: '2021-12-15',
        precio: 220,
        cantidad: 8,
        ProductoId: idPilas,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        proveedor: 'Almacén El Simpático',
        fecha: '2021-11-08',
        precio: 720,
        cantidad: 2,
        ProductoId: idAlcohol,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
