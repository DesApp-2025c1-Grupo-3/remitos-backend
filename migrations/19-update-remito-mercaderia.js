'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Eliminar columna mercaderiaId de Remitos si existe
    const tableRemitos = await queryInterface.describeTable('Remitos');
    if (tableRemitos.mercaderiaId) {
      await queryInterface.removeColumn('Remitos', 'mercaderiaId');
    }

    // 2. Agregar remitoId en Mercaderias
    const tableMercaderias = await queryInterface.describeTable('Mercaderia');
    if (!tableMercaderias.remitoId) {
      await queryInterface.addColumn('Mercaderia', 'remitoId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Remitos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    // 3. Agregar fechaAgenda y remitoFirmado en Remitos
    if (!tableRemitos.fechaAgenda) {
      await queryInterface.addColumn('Remitos', 'fechaAgenda', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    if (!tableRemitos.remitoFirmado) {
      await queryInterface.addColumn('Remitos', 'remitoFirmado', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios
    const tableMercaderias = await queryInterface.describeTable('Mercaderias');
    const tableRemitos = await queryInterface.describeTable('Remitos');

    if (tableMercaderias.remitoId) {
      await queryInterface.removeColumn('Mercaderias', 'remitoId');
    }
    if (tableRemitos.fechaAgenda) {
      await queryInterface.removeColumn('Remitos', 'fechaAgenda');
    }
    if (tableRemitos.remitoFirmado) {
      await queryInterface.removeColumn('Remitos', 'remitoFirmado');
    }

    // Opción: si quieres re-agregar mercaderiaId en Remitos
    // if (!tableRemitos.mercaderiaId) {
    //   await queryInterface.addColumn('Remitos', 'mercaderiaId', {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //   });
    // }
  },
};
