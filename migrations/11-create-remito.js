"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Remitos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      numeroAsignado: {
        type: Sequelize.STRING,
      },
      fechaEmision: {
        type: Sequelize.DATE,
      },
      observaciones: {
        type: Sequelize.STRING,
      },
      archivoAdjunto: {
        type: Sequelize.STRING,
      },
      prioridad: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
      estadoId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Estados",
          key: "id",
        },
      },
      mercaderiaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Mercaderia",
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
      fechaAgenda: {
        allowNull: true,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Remitos");
  },
};
