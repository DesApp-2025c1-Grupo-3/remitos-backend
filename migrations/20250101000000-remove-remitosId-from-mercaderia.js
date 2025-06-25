"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar si existe la columna remitosId antes de intentar eliminarla
    const [results] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Mercaderia' 
      AND COLUMN_NAME = 'remitosId'
    `);

    if (results.length > 0) {
      // Solo eliminar si existe
      await queryInterface.removeColumn("Mercaderia", "remitosId");
    }
    // Si no existe, no hacer nada (ya está corregido)
  },

  async down(queryInterface, Sequelize) {
    // Restaurar el campo en caso de rollback (usando nombre correcto de tabla)
    await queryInterface.addColumn("Mercaderia", "remitosId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Remitos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
};
