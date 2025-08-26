'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificamos que no haya valores NULL en tipoMercaderiaId
    const nullCount = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM "Mercaderia" WHERE "tipoMercaderiaId" IS NULL',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (nullCount[0].count > 0) {
      throw new Error(`Hay ${nullCount[0].count} registros con tipoMercaderiaId NULL. Debe actualizarlos antes de establecer NOT NULL.`);
    }

    // Cambiamos la columna para que no permita NULL
    await queryInterface.changeColumn('Mercaderia', 'tipoMercaderiaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TipoMercaderias',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertimos a allowNull: true
    await queryInterface.changeColumn('Mercaderia', 'tipoMercaderiaId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'TipoMercaderias',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  }
};
