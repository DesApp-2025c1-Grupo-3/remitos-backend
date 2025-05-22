'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mercaderias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipoMercaderia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      valorDeclarado: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      volumenMetrosCubico: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pesoMercaderia: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cantidadBobinas: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cantidadRacks: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cantidadBultos: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cantidadPallets: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      requisitosEspeciales: {
        type: Sequelize.STRING,
        allowNull: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      remitosId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Remitos', // Asegurate que la tabla Remitos exista
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      estadoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Estados', // Asegurate que la tabla Estados exista
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Mercaderias');
  }
};