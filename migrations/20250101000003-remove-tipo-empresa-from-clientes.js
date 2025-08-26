'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si la tabla existe y si la columna existe antes de removerla
    try {
      const tableDescription = await queryInterface.describeTable('Clientes');
      if (tableDescription.tipoEmpresa) {
        // Solo removemos la columna si existe
        await queryInterface.removeColumn('Clientes', 'tipoEmpresa');
      }
    } catch (error) {
      // Si la tabla no existe, no hacemos nada
      console.log('Tabla Clientes no existe, saltando migración');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Verificar si la tabla existe antes de agregar la columna
    try {
      const tableDescription = await queryInterface.describeTable('Clientes');
      if (!tableDescription.tipoEmpresa) {
        // Agregar de vuelta la columna tipoEmpresa
        await queryInterface.addColumn('Clientes', 'tipoEmpresa', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }
    } catch (error) {
      // Si la tabla no existe, no hacemos nada
      console.log('Tabla Clientes no existe, saltando migración');
    }
  }
};
