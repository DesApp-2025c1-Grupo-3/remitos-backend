"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Remitos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numeroAsignado: {
        type: Sequelize.STRING
      },
      tipoMercaderia: {
        type: Sequelize.STRING
      },
      valorDeclarado: {
        type: Sequelize.INTEGER
      },
      volumenMetrosCubico: {
        type: Sequelize.INTEGER
      },
      pesoMercaderia: {
        type: Sequelize.INTEGER
      },
      fechaEmision: {
        type: Sequelize.DATE
      },
      cantidadBobinas: {
        type: Sequelize.INTEGER
      },
      cantidadRacks: {
        type: Sequelize.INTEGER
      },
      cantidadBultos: {
        type: Sequelize.INTEGER
      },
      cantidadPallets: {
        type: Sequelize.INTEGER
      },
      requisitosEspeciales: {
        type: Sequelize.STRING
      },
      observaciones: {
        type: Sequelize.STRING
      },
      archivoAdjunto: {
        type: Sequelize.STRING
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Remitos");
  }
};
//# sourceMappingURL=20250425001856-create-remito.js.map