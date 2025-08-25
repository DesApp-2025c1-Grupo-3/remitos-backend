'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Clientes', 'tipoEmpresaId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'TipoEmpresas',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Crear índice para mejorar el rendimiento de las consultas
    await queryInterface.addIndex('Clientes', ['tipoEmpresaId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remover el índice primero
    await queryInterface.removeIndex('Clientes', ['tipoEmpresaId']);
    
    // Remover la columna
    await queryInterface.removeColumn('Clientes', 'tipoEmpresaId');
  }
};
