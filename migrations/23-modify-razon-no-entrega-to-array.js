"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔄 Modificando razonNoEntrega para soportar múltiples razones...');
    
    // Primero, crear una nueva columna temporal para almacenar las razones como JSON
    await queryInterface.addColumn('Remitos', 'razonesNoEntrega', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    
    // Migrar datos existentes: convertir string a array
    await queryInterface.sequelize.query(`
      UPDATE "Remitos" 
      SET "razonesNoEntrega" = CASE 
        WHEN "razonNoEntrega" IS NOT NULL AND "razonNoEntrega" != '' 
        THEN jsonb_build_array("razonNoEntrega")
        ELSE NULL 
      END
    `);
    
    // Eliminar la columna antigua
    await queryInterface.removeColumn('Remitos', 'razonNoEntrega');
    
    console.log('✅ Campo razonNoEntrega modificado a array correctamente');
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔄 Revirtiendo cambios de razonNoEntrega...');
    
    // Crear la columna antigua
    await queryInterface.addColumn('Remitos', 'razonNoEntrega', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    // Migrar datos: tomar la primera razón del array
    await queryInterface.sequelize.query(`
      UPDATE "Remitos" 
      SET "razonNoEntrega" = CASE 
        WHEN "razonesNoEntrega" IS NOT NULL AND jsonb_array_length("razonesNoEntrega") > 0
        THEN "razonesNoEntrega"->>0
        ELSE NULL 
      END
    `);
    
    // Eliminar la columna nueva
    await queryInterface.removeColumn('Remitos', 'razonesNoEntrega');
    
    console.log('✅ Cambios revertidos correctamente');
  },
};
