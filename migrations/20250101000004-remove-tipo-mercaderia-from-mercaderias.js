'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remover la columna tipoMercaderia
    await queryInterface.removeColumn('Mercaderias', 'tipoMercaderia');
  },

  down: async (queryInterface, Sequelize) => {
    // Agregar de vuelta la columna tipoMercaderia
    await queryInterface.addColumn('Mercaderias', 'tipoMercaderia', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
