const { sequelize } = require('../lib/models');

async function resetSequences() {
  try {
    console.log('🔄 Reseteando secuencias de IDs...');
    
    // Resetear secuencias para entidades normalizadas
    await sequelize.query('ALTER SEQUENCE "Estados_id_seq" RESTART WITH 1;');
    console.log('✅ Secuencia de Estados reseteada');
    
    await sequelize.query('ALTER SEQUENCE "TipoEmpresas_id_seq" RESTART WITH 1;');
    console.log('✅ Secuencia de TipoEmpresas reseteada');
    
    await sequelize.query('ALTER SEQUENCE "TipoMercaderias_id_seq" RESTART WITH 1;');
    console.log('✅ Secuencia de TipoMercaderias reseteada');
    
    console.log('🎉 Todas las secuencias han sido reseteadas correctamente');
    
    // Verificar IDs mínimos
    const [estadosResult] = await sequelize.query('SELECT MIN(id) as min_id FROM "Estados";');
    const [tiposEmpresaResult] = await sequelize.query('SELECT MIN(id) as min_id FROM "TipoEmpresas";');
    const [tiposMercaderiaResult] = await sequelize.query('SELECT MIN(id) as min_id FROM "TipoMercaderias";');
    
    console.log('📊 Verificación de IDs mínimos:');
    console.log(`  - Estados: ${estadosResult[0]?.min_id || 'N/A'}`);
    console.log(`  - TipoEmpresas: ${tiposEmpresaResult[0]?.min_id || 'N/A'}`);
    console.log(`  - TipoMercaderias: ${tiposMercaderiaResult[0]?.min_id || 'N/A'}`);
    
  } catch (error) {
    console.error('❌ Error al resetear secuencias:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  resetSequences();
}

module.exports = { resetSequences };
