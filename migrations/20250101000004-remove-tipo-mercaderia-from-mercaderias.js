'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si la tabla existe y si la columna existe antes de removerla
    try {
      const tableDescription = await queryInterface.describeTable('Mercaderia');
      if (tableDescription.tipoMercaderia) {
        // Remover la columna tipoMercaderia
        await queryInterface.removeColumn('Mercaderia', 'tipoMercaderia');
      }
    } catch (error) {
      // Si la tabla no existe, no hacemos nada
      console.log('Tabla Mercaderia no existe, saltando migración');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Verificar si la tabla existe antes de agregar la columna
    try {
      const tableDescription = await queryInterface.describeTable('Mercaderia');
      if (!tableDescription.tipoMercaderia) {
        // Agregar de vuelta la columna tipoMercaderia
        await queryInterface.addColumn('Mercaderia', 'tipoMercaderia', {
          type: Sequelize.STRING,
          allowNull: false
        });
      }
    } catch (error) {
      // Si la tabla no existe, no hacemos nada
      console.log('Tabla Mercaderia no existe, saltando migración');
    }
  }
};
