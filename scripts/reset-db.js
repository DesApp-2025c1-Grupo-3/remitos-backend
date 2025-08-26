#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Iniciando limpieza de base de datos...');

try {
  // Detener los contenedores
  console.log('⏹️  Deteniendo contenedores...');
  execSync('docker compose down', { stdio: 'inherit' });

  // Eliminar el volumen de la base de datos (si existe)
  console.log('🗑️  Eliminando volumen de base de datos...');
  try {
    execSync('docker volume rm remitos-backend_postgres_data', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  El volumen ya no existe, continuando...');
  }

  // Reconstruir y levantar los contenedores
  console.log('🔨 Reconstruyendo contenedores...');
  execSync('docker compose up --build -d', { stdio: 'inherit' });

  // Esperar a que la base de datos esté lista
  console.log('⏳ Esperando a que la base de datos esté lista...');
  setTimeout(() => {
    try {
      // Ejecutar migraciones
      console.log('📋 Ejecutando migraciones...');
      execSync('docker compose exec app npx sequelize-cli db:migrate', { stdio: 'inherit' });

      console.log('✅ Base de datos reiniciada exitosamente!');
    } catch (error) {
      console.error('❌ Error ejecutando migraciones o seeds:', error.message);
    }
  }, 10000); // Esperar 10 segundos

} catch (error) {
  console.error('❌ Error durante la limpieza:', error.message);
  process.exit(1);
}
