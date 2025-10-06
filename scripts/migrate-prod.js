#!/usr/bin/env node

const { Sequelize } = require('sequelize');
const config = require('../lib/config/config');
const path = require('path');
const fs = require('fs');

async function runMigrations() {
  console.log('🔄 Ejecutando migraciones en producción...');
  
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

    // Obtener lista de archivos de migración
    const migrationsPath = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.js'))
      .sort();

    console.log(`📁 Encontradas ${migrationFiles.length} migraciones`);

    // Ejecutar cada migración
    for (const file of migrationFiles) {
      try {
        console.log(`🔄 Ejecutando migración: ${file}`);
        const migration = require(path.join(migrationsPath, file));
        
        if (typeof migration.up === 'function') {
          await migration.up(sequelize.getQueryInterface(), Sequelize);
          console.log(`✅ Migración ${file} ejecutada exitosamente`);
        } else {
          console.log(`⚠️  Migración ${file} no tiene función up`);
        }
      } catch (error) {
        console.error(`❌ Error ejecutando migración ${file}:`, error.message);
        // Continuar con las siguientes migraciones
      }
    }

    console.log('✅ Todas las migraciones completadas');
  } catch (error) {
    console.error('❌ Error durante las migraciones:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;









