'use strict';
module.exports = {
  up: async (qi, Sequelize) => {
    const t = await qi.describeTable('Clientes');

    // 1) Agregar FK solo si no existe
    if (!t.tipoEmpresaId) {
      await qi.addColumn('Clientes', 'tipoEmpresaId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'TipoEmpresas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      await qi.addIndex('Clientes', ['tipoEmpresaId']);
    }

    // 2) (Opcional) migrar datos si aún existe la vieja
    if (t.tipoEmpresa) {
      // si tenías strings/códigos en 'tipoEmpresa', acá mapearías a IDs
      // await qi.sequelize.query(`UPDATE "Clientes" SET "tipoEmpresaId" = ...`);
      await qi.removeColumn('Clientes', 'tipoEmpresa'); // borrar solo si existía
    }
  },

  down: async (qi) => {
    const t = await qi.describeTable('Clientes');
    if (!t.tipoEmpresa) {
      await qi.addColumn('Clientes', 'tipoEmpresa', { type: qi.sequelize.STRING, allowNull: true });
    }
    if (t.tipoEmpresaId) {
      await qi.removeColumn('Clientes', 'tipoEmpresaId');
    }
  }
};
