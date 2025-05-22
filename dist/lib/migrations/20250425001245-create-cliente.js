"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Clientes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      razonSocial: {
        type: Sequelize.STRING
      },
      cuit_rut: {
        type: Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      tipoEmpresa: {
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
    await queryInterface.dropTable("Clientes");
  }
};
//# sourceMappingURL=20250425001245-create-cliente.js.map