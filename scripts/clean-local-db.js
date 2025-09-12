#!/usr/bin/env node

/**
 * Script para limpiar la base de datos local
 * Elimina todos los datos de prueba pero mantiene los datos maestros (estados, tipos)
 */

const { 
  Cliente, 
  Destino, 
  Remito, 
  Mercaderia, 
  Contacto, 
  Estado, 
  TipoEmpresa, 
  TipoMercaderia,
  sequelize
} = require('../lib/models');

async function cleanDatabase() {
  try {
    console.log('🧹 Iniciando limpieza de base de datos...');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Eliminar en orden correcto (respetando foreign keys)
    console.log('🗑️ Eliminando mercaderías...');
    await Mercaderia.destroy({ where: {}, force: true });
    
    console.log('🗑️ Eliminando remitos...');
    await Remito.destroy({ where: {}, force: true });
    
    console.log('🗑️ Eliminando contactos...');
    await Contacto.destroy({ where: {}, force: true });
    
    console.log('🗑️ Eliminando destinos...');
    await Destino.destroy({ where: {}, force: true });
    
    console.log('🗑️ Eliminando clientes...');
    await Cliente.destroy({ where: {}, force: true });

    // Resetear secuencias para que los próximos IDs empiecen desde 1
    console.log('🔄 Reseteando secuencias...');
    const tables = [
      { table: 'Clientes', sequence: 'Clientes_id_seq' },
      { table: 'Destinos', sequence: 'Destinos_id_seq' },
      { table: 'Remitos', sequence: 'Remitos_id_seq' },
      { table: 'Mercaderia', sequence: 'Mercaderia_id_seq' },
      { table: 'Contactos', sequence: 'Contactos_id_seq' }
    ];

    for (const { table, sequence } of tables) {
      try {
        await sequelize.query(
          `ALTER SEQUENCE "${sequence}" RESTART WITH 1`,
          { type: sequelize.QueryTypes.RAW }
        );
        console.log(`   ✅ ${table}: Secuencia reseteada a 1`);
      } catch (error) {
        console.log(`   ⚠️ ${table}: Error al resetear secuencia`);
      }
    }

    // Verificar que los datos maestros siguen intactos
    const estadosCount = await Estado.count();
    const tipoEmpresasCount = await TipoEmpresa.count();
    const tipoMercaderiasCount = await TipoMercaderia.count();

    console.log('\n🎉 ¡Base de datos limpiada exitosamente!');
    console.log('\n📊 Datos maestros preservados:');
    console.log(`   • ${estadosCount} Estados`);
    console.log(`   • ${tipoEmpresasCount} Tipos de empresa`);
    console.log(`   • ${tipoMercaderiasCount} Tipos de mercadería`);
    console.log('\n✨ Las secuencias han sido reseteadas - los próximos IDs empezarán desde 1');

  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
if (require.main === module) {
  cleanDatabase()
    .then(() => {
      console.log('\n✨ Limpieza completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { cleanDatabase };
