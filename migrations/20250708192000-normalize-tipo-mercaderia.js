"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar la columna tipoMercaderia
    await queryInterface.removeColumn("Mercaderia", "tipoMercaderia");
    // Agregar la columna tipoMercaderiaId
    await queryInterface.addColumn("Mercaderia", "tipoMercaderiaId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "TipoMercaderia",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Quitar la columna tipoMercaderiaId
    await queryInterface.removeColumn("Mercaderia", "tipoMercaderiaId");
    // Volver a agregar la columna tipoMercaderia
    await queryInterface.addColumn("Mercaderia", "tipoMercaderia", {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
}; 