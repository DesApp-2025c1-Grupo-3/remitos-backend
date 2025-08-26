'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TipoMercaderias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Agregar índices para mejorar performance
    await queryInterface.addIndex('TipoMercaderias', ['nombre']);
    await queryInterface.addIndex('TipoMercaderias', ['activo']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TipoMercaderias');
  }
};
