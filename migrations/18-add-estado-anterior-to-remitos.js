'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Remitos', 'estadoAnteriorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Estados',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Remitos', 'estadoAnteriorId');
  }
};
