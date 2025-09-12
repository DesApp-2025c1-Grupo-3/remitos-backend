#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Ejecutando: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${command} completado exitosamente`);
        resolve();
      } else {
        console.error(`❌ ${command} falló con código ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error(`❌ Error ejecutando ${command}:`, error);
      reject(error);
    });
  });
}

async function deploy() {
  try {
    console.log('🚀 Iniciando deploy de producción...');
    
    // Esperar un poco para que la base de datos esté lista
    console.log('⏳ Esperando a que la base de datos esté lista...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Ejecutar migraciones (siempre necesarias)
    try {
      console.log('🔄 Ejecutando migraciones...');
      await runCommand('npm', ['run', 'db:migrate:prod']);
    } catch (error) {
      console.log('⚠️  Migraciones fallaron, continuando...');
    }
    
    // Ejecutar ciclo completo de población automáticamente
    try {
      console.log('🌱 Ejecutando seeds de normalización...');
      await runCommand('npm', ['run', 'db:seed:prod']);
      
      console.log('📊 Poblando base de datos con datos de prueba...');
      await runCommand('npm', ['run', 'populate-db']);
      
      console.log('🔍 Verificando IDs generados...');
      await runCommand('npm', ['run', 'check-ids']);
      
      console.log('🔄 Reseteando secuencias de IDs...');
      await runCommand('npm', ['run', 'reset-sequences']);
      
      console.log('✅ Ciclo completo de población ejecutado exitosamente');
      
    } catch (error) {
      console.log('⚠️  Algunos pasos del ciclo completo fallaron, continuando...');
      console.log('Error:', error.message);
    }
    
    // Iniciar la aplicación
    console.log('🚀 Iniciando aplicación...');
    await runCommand('npm', ['start']);
    
  } catch (error) {
    console.error('❌ Error durante el deploy:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  deploy();
}

module.exports = deploy;
