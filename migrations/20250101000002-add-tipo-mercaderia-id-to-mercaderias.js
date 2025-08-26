'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero verificamos si la columna ya existe
    const tableDescription = await queryInterface.describeTable('Mercaderia');
    
    if (!tableDescription.tipoMercaderiaId) {
      // Solo agregamos la columna si no existe
      await queryInterface.addColumn('Mercaderia', 'tipoMercaderiaId', {
        type: Sequelize.INTEGER,
        allowNull: true, // Cambiamos a true temporalmente
        references: {
          model: 'TipoMercaderias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });

      // Crear índice para mejorar el rendimiento de las consultas
      await queryInterface.addIndex('Mercaderia', ['tipoMercaderiaId']);

      // Verificar si hay tipos de mercadería, si no, crear uno por defecto
      const tipoMercaderias = await queryInterface.sequelize.query(
        'SELECT id FROM "TipoMercaderias" LIMIT 1',
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (tipoMercaderias.length === 0) {
        // Si no hay tipos de mercadería, creamos uno por defecto
        await queryInterface.bulkInsert('TipoMercaderias', [{
          descripcion: 'Tipo de mercadería general',
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
      }

      // Obtenemos el ID del primer tipo de mercadería (o el que acabamos de crear)
      const [tipoMercaderia] = await queryInterface.sequelize.query(
        'SELECT id FROM "TipoMercaderias" LIMIT 1',
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Actualizamos todos los registros existentes de Mercaderia para que tengan un tipoMercaderiaId
      await queryInterface.sequelize.query(
        'UPDATE "Mercaderia" SET "tipoMercaderiaId" = :tipoId WHERE "tipoMercaderiaId" IS NULL',
        {
          replacements: { tipoId: tipoMercaderia.id },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remover el índice primero
    await queryInterface.removeIndex('Mercaderia', ['tipoMercaderiaId']);
    
    // Remover la columna
    await queryInterface.removeColumn('Mercaderia', 'tipoMercaderiaId');
  }
};
