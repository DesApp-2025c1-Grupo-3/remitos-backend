#!/usr/bin/env node

/**
 * Script para resetear las secuencias de PostgreSQL
 * Esto corrige el problema de numeración de IDs que no empiezan desde 1
 */

const { sequelize } = require('../lib/models');

async function resetSequences() {
  try {
    console.log('🔄 Reseteando secuencias de PostgreSQL...\n');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida\n');

    // Lista de tablas y sus secuencias
    const tables = [
      { table: 'Clientes', sequence: 'Clientes_id_seq' },
      { table: 'Destinos', sequence: 'Destinos_id_seq' },
      { table: 'Remitos', sequence: 'Remitos_id_seq' },
      { table: 'Mercaderia', sequence: 'Mercaderia_id_seq' },
      { table: 'Contactos', sequence: 'Contactos_id_seq' }
    ];

    for (const { table, sequence } of tables) {
      try {
        // Obtener el máximo ID actual
        const result = await sequelize.query(
          `SELECT MAX(id) as max_id FROM "${table}"`,
          { type: sequelize.QueryTypes.SELECT }
        );
        
        const maxId = result[0]?.max_id || 0;
        const nextId = maxId + 1;
        
        // Resetear la secuencia
        await sequelize.query(
          `ALTER SEQUENCE "${sequence}" RESTART WITH ${nextId}`,
          { type: sequelize.QueryTypes.RAW }
        );
        
        console.log(`✅ ${table}: Secuencia resetada a ${nextId}`);
        
      } catch (error) {
        console.log(`⚠️ ${table}: Error al resetear secuencia - ${error.message}`);
      }
    }

    console.log('\n🎉 ¡Secuencias reseteadas exitosamente!');
    console.log('\n📝 Nota: Los próximos registros creados tendrán IDs secuenciales correctos.');

  } catch (error) {
    console.error('❌ Error al resetear secuencias:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
if (require.main === module) {
  resetSequences()
    .then(() => {
      console.log('\n✨ Reset completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { resetSequences };








