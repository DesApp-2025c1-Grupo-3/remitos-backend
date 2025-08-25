'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Mercaderias', 'tipoMercaderiaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TipoMercaderias',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // Crear índice para mejorar el rendimiento de las consultas
    await queryInterface.addIndex('Mercaderias', ['tipoMercaderiaId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remover el índice primero
    await queryInterface.removeIndex('Mercaderias', ['tipoMercaderiaId']);
    
    // Remover la columna
    await queryInterface.removeColumn('Mercaderias', 'tipoMercaderiaId');
  }
};
