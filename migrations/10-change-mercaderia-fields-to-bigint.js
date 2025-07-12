"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Mercaderia", "valorDeclarado", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Mercaderia", "volumenMetrosCubico", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Mercaderia", "pesoMercaderia", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadBobinas", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadRacks", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadBultos", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadPallets", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Mercaderia", "valorDeclarado", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("Mercaderia", "volumenMetrosCubico", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("Mercaderia", "pesoMercaderia", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadBobinas", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadRacks", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadBultos", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("Mercaderia", "cantidadPallets", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
