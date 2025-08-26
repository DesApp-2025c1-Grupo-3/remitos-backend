'use strict';

module.exports = {
  up: async (qi, Sequelize) => {
    const t = await qi.describeTable('Mercaderia'); // 👈 nombre real de la tabla

    // Agregar FK solo si no existe
    if (!t.tipoMercaderiaId) {
      await qi.addColumn('Mercaderia', 'tipoMercaderiaId', {
        type: Sequelize.INTEGER,
        allowNull: true, // poné true para migrar sin cortar; luego podés volverla NOT NULL
        references: { model: 'TipoMercaderias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });
      await qi.addIndex('Mercaderia', ['tipoMercaderiaId']);
    }

    // Si aún existe la vieja columna, borrarla
    if (t.tipoMercaderia) {
      // si querés migrar valores antiguos → acá mapeás a IDs antes de borrar
      await qi.removeColumn('Mercaderia', 'tipoMercaderia');
    }
  },

  down: async (qi) => {
    const t = await qi.describeTable('Mercaderia');
    if (!t.tipoMercaderia) {
      await qi.addColumn('Mercaderia', 'tipoMercaderia', { type: qi.sequelize.STRING, allowNull: true });
    }
    if (t.tipoMercaderiaId) {
      await qi.removeColumn('Mercaderia', 'tipoMercaderiaId');
    }
  }
};
