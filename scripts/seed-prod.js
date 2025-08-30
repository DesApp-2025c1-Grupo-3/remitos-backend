#!/usr/bin/env node

const { Sequelize } = require('sequelize');
const config = require('../lib/config/config');
const path = require('path');

async function runSeeds() {
  console.log('🌱 Verificando seeds de normalización...');
  
  // Crear instancia de Sequelize con la configuración de producción
  const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      host: config.db.host,
      dialect: config.db.dialect,
      port: config.db.port,
      logging: false,
      dialectOptions: config.db.dialectOptions,
      schema: config.db.schema,
      seederStorage: config.db.seederStorage
    }
  );

  try {
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');

    // Verificar si ya existen datos de normalización
    const [estados] = await sequelize.query('SELECT COUNT(*) as count FROM "Estados"');
    const [tiposEmpresa] = await sequelize.query('SELECT COUNT(*) as count FROM "TipoEmpresas"');
    const [tiposMercaderia] = await sequelize.query('SELECT COUNT(*) as count FROM "TipoMercaderias"');

    const hasEstados = parseInt(estados[0].count) > 0;
    const hasTiposEmpresa = parseInt(tiposEmpresa[0].count) > 0;
    const hasTiposMercaderia = parseInt(tiposMercaderia[0].count) > 0;

    console.log(`📊 Estado actual:`);
    console.log(`   - Estados: ${hasEstados ? '✅ Existen' : '❌ Faltan'}`);
    console.log(`   - Tipos de empresa: ${hasTiposEmpresa ? '✅ Existen' : '❌ Faltan'}`);
    console.log(`   - Tipos de mercadería: ${hasTiposMercaderia ? '✅ Existen' : '❌ Faltan'}`);

    // Si todos los datos ya existen, no hacer nada
    if (hasEstados && hasTiposEmpresa && hasTiposMercaderia) {
      console.log('✅ Todos los datos de normalización ya existen. Saltando seeds.');
      return;
    }

    console.log('🔄 Ejecutando seeds faltantes...');

    // Seeds de normalización (en orden de dependencia)
    const seeds = [
      { file: '20250101000000-initial-estados.js', exists: hasEstados },
      { file: '20250101000005-seed-tipos-empresa.js', exists: hasTiposEmpresa },
      { file: '20250101000006-seed-tipos-mercaderia.js', exists: hasTiposMercaderia }
    ];

    for (const seed of seeds) {
      if (seed.exists) {
        console.log(`ℹ️  Saltando ${seed.file} (ya existe)`);
        continue;
      }

      try {
        console.log(`🌱 Ejecutando seed: ${seed.file}`);
        const seedModule = require(path.join(__dirname, '..', 'seeders', seed.file));
        
        if (typeof seedModule.up === 'function') {
          await seedModule.up(sequelize.getQueryInterface(), Sequelize);
          console.log(`✅ Seed ${seed.file} ejecutado exitosamente`);
        } else {
          console.log(`⚠️  Seed ${seed.file} no tiene función up`);
        }
      } catch (error) {
        if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
          console.log(`ℹ️  Seed ${seed.file} ya fue ejecutado anteriormente`);
        } else {
          console.error(`❌ Error ejecutando seed ${seed.file}:`, error.message);
        }
      }
    }

    console.log('✅ Seeds de normalización completados');
  } catch (error) {
    console.error('❌ Error durante los seeds:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeeds();
}

module.exports = runSeeds;
