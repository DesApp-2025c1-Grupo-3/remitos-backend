"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Contactos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      personaAutorizada: {
        type: Sequelize.STRING,
      },
      correoElectronico: {
        type: Sequelize.STRING,
      },
      telefono: {
        type: Sequelize.STRING,
      },
      clienteId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Clientes",
          key: "id",
        },
      },
      destinoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Destinos",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Contactos");
  },
};
