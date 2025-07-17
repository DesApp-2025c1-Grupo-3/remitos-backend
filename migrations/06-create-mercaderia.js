"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Mercaderia", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tipoMercaderia: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      valorDeclarado: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      volumenMetrosCubico: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pesoMercaderia: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cantidadBobinas: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cantidadRacks: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cantidadBultos: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cantidadPallets: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      requisitosEspeciales: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      estadoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Mercaderia");
  },
};
