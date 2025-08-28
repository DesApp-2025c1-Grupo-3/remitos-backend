const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de la base de datos
const config = {
  username: process.env.SQL_USERNAME || process.env.DB_USER || 'postgres',
  password: process.env.SQL_PASSWORD || process.env.DB_PASS || '1234',
  database: process.env.SQL_DATABASE || process.env.DB_NAME || 'desapp',
  host: process.env.SQL_HOST || process.env.DB_HOST || 'localhost',
  port: process.env.SQL_PORT || '5432',
  dialect: 'postgres',
  logging: false,
  native: process.env.NODE_ENV === 'production'
};

// Si hay DATABASE_URL, usarla
if (process.env.DATABASE_URL) {
  const { parse } = require('pg-connection-string');
  const parsed = parse(process.env.DATABASE_URL);
  Object.assign(config, {
    ...parsed,
    username: parsed.user,
    native: true
  });
}

console.log('🔧 Configuración de base de datos:', {
  host: config.host,
  port: config.port,
  database: config.database,
  username: config.username
});

// Crear conexión
const sequelize = new Sequelize(config);

async function waitForDatabase() {
  console.log('⏳ Esperando a que la base de datos esté lista...');
  
  for (let i = 0; i < 10; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Base de datos lista y accesible');
      return true;
    } catch (error) {
      console.log(`⚠️  Intento ${i + 1}/10: No se pudo conectar a la base de datos`);
      if (i < 9) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  
  console.log('❌ No se pudo conectar a la base de datos después de múltiples intentos');
  return false;
}

async function runMigrations() {
  if (process.env.RUN_MIGRATIONS !== 'true') {
    console.log('ℹ️  Migraciones omitidas (RUN_MIGRATIONS no está habilitado)');
    return;
  }

  console.log('🔄 Ejecutando migraciones...');
  
  try {
    const { execSync } = require('child_process');
    // Usar el comando completo con la configuración
    execSync('npx sequelize-cli db:migrate --env production', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log('✅ Migraciones completadas');
  } catch (error) {
    console.log('⚠️  Algunas migraciones fallaron (puede ser normal si ya están aplicadas)');
  }
}

async function cleanAndResetEntities() {
  console.log('🧹 Limpiando entidades normalizadas...');
  
  try {
    await sequelize.query('DELETE FROM "Estados";');
    await sequelize.query('DELETE FROM "TipoEmpresas";');
    await sequelize.query('DELETE FROM "TipoMercaderias";');
    
    console.log('🔄 Reseteando secuencias de IDs...');
    await sequelize.query('ALTER SEQUENCE "Estados_id_seq" RESTART WITH 1;');
    await sequelize.query('ALTER SEQUENCE "TipoEmpresas_id_seq" RESTART WITH 1;');
    await sequelize.query('ALTER SEQUENCE "TipoMercaderias_id_seq" RESTART WITH 1;');
    
    console.log('✅ Entidades normalizadas limpiadas y secuencias reseteadas');
  } catch (error) {
    console.log('⚠️  Error al limpiar entidades:', error.message);
  }
}

async function runSeeds() {
  if (process.env.RUN_SEEDS !== 'true') {
    console.log('ℹ️  Seeds omitidos (RUN_SEEDS no está habilitado)');
    return;
  }

  console.log('🌱 Ejecutando seeds de normalización...');
  
  try {
    await cleanAndResetEntities();
    
    const { execSync } = require('child_process');
    const seeds = [
      '20250101000000-initial-estados.js',
      '20250101000005-seed-tipos-empresa.js',
      '20250101000006-seed-tipos-mercaderia.js'
    ];
    
    for (const seed of seeds) {
      try {
        execSync(`npx sequelize-cli db:seed --seed ${seed} --env production`, { 
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: 'production' }
        });
      } catch (error) {
        console.log(`⚠️  Seed ${seed} falló`);
      }
    }
    
    console.log('✅ Seeds de normalización completados');
  } catch (error) {
    console.log('⚠️  Error al ejecutar seeds:', error.message);
  }
}

async function verifyEntities() {
  console.log('🔍 Verificando entidades normalizadas...');
  
  try {
    const [estados] = await sequelize.query('SELECT MIN(id) as min_id FROM "Estados";');
    const [tiposEmpresa] = await sequelize.query('SELECT MIN(id) as min_id FROM "TipoEmpresas";');
    const [tiposMercaderia] = await sequelize.query('SELECT MIN(id) as min_id FROM "TipoMercaderias";');
    
    console.log('📊 IDs mínimos:', {
      estados: estados[0]?.min_id,
      tiposEmpresa: tiposEmpresa[0]?.min_id,
      tiposMercaderia: tiposMercaderia[0]?.min_id
    });
    
    console.log('✅ Verificación de entidades normalizadas completada');
  } catch (error) {
    console.log('⚠️  Error al verificar entidades:', error.message);
  }
}

async function main() {
  try {
    const isConnected = await waitForDatabase();
    if (!isConnected) {
      process.exit(1);
    }
    
    await runMigrations();
    await runSeeds();
    await verifyEntities();
    
    console.log('🚀 Configuración de base de datos completada');
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main();
