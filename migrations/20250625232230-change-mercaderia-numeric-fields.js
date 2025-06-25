"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // Ahora cambiar los tipos de datos
    await queryInterface.changeColumn("Mercaderia", "valorDeclarado", {
      type: Sequelize.DECIMAL(15, 2), // Hasta 999,999,999,999,999.99
      allowNull: false,
    });

    await queryInterface.changeColumn("Mercaderia", "volumenMetrosCubico", {
      type: Sequelize.DECIMAL(12, 3), // Hasta 999,999,999.999 m³
      allowNull: false,
    });

    await queryInterface.changeColumn("Mercaderia", "pesoMercaderia", {
      type: Sequelize.DECIMAL(15, 3), // Hasta 999,999,999,999.999 kg
      allowNull: false,
    });

    // Las cantidades pueden seguir siendo INTEGER pero con BIGINT para mayor rango
    await queryInterface.changeColumn("Mercaderia", "cantidadBobinas", {
      type: Sequelize.BIGINT, // Rango mucho mayor que INTEGER
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
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
