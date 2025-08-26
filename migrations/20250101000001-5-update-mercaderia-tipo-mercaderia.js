'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero verificamos si la tabla TipoMercaderias existe y tiene datos
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
  },

  down: async (queryInterface, Sequelize) => {
    // No podemos revertir esto de manera segura
    // ya que no sabemos qué valores tenían originalmente
  }
};
