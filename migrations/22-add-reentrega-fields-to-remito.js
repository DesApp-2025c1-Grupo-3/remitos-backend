"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔄 Agregando campo de reentrega a tabla Remitos...');
    
    // Agregar campo esReentrega
    await queryInterface.addColumn('Remitos', 'esReentrega', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    
    console.log('✅ Campo de reentrega agregado correctamente');
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔄 Eliminando campo de reentrega de tabla Remitos...');
    
    await queryInterface.removeColumn('Remitos', 'esReentrega');
    
    console.log('✅ Campo de reentrega eliminado correctamente');
  },
};

