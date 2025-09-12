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
    
    // Verificar variable de entorno para poblar la base de datos
    const shouldPopulateDB = process.env.POPULATE_DB === 'true';
    console.log(`📊 Variable POPULATE_DB: ${process.env.POPULATE_DB || 'false'}`);
    console.log(`🌱 Poblar base de datos: ${shouldPopulateDB ? '✅ SÍ' : '❌ NO'}`);
    
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
    
    // Ejecutar seeds solo si la variable de entorno lo indica
    if (shouldPopulateDB) {
      try {
        console.log('🌱 Ejecutando seeds (poblar base de datos)...');
        await runCommand('npm', ['run', 'db:seed:prod']);
      } catch (error) {
        console.log('⚠️  Seeds fallaron, continuando...');
      }
    } else {
      console.log('ℹ️  Saltando seeds - POPULATE_DB no está configurado como true');
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
