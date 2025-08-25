'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remover la columna tipoEmpresa
    await queryInterface.removeColumn('Clientes', 'tipoEmpresa');
  },

  down: async (queryInterface, Sequelize) => {
    // Agregar de vuelta la columna tipoEmpresa
    await queryInterface.addColumn('Clientes', 'tipoEmpresa', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
