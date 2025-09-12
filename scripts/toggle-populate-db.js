#!/usr/bin/env node

/**
 * Script para facilitar el manejo de la variable POPULATE_DB
 * Uso: node scripts/toggle-populate-db.js [true|false]
 */

const args = process.argv.slice(2);
const newValue = args[0];

if (!newValue || !['true', 'false'].includes(newValue)) {
  console.log('📋 Uso: node scripts/toggle-populate-db.js [true|false]');
  console.log('');
  console.log('Ejemplos:');
  console.log('  node scripts/toggle-populate-db.js true   # Habilitar poblar BD');
  console.log('  node scripts/toggle-populate-db.js false  # Deshabilitar poblar BD');
  console.log('');
  console.log('ℹ️  Esta variable controla si se ejecutan los seeds durante el deploy');
  console.log('   - true:  Se poblará la base de datos con datos iniciales');
  console.log('   - false: Solo se ejecutarán las migraciones (comportamiento por defecto)');
  process.exit(1);
}

console.log('🔧 Configuración de POPULATE_DB:');
console.log('');
console.log(`📊 Valor actual: ${process.env.POPULATE_DB || 'false'}`);
console.log(`📊 Nuevo valor:  ${newValue}`);
console.log('');

if (newValue === 'true') {
  console.log('✅ POPULATE_DB habilitado');
  console.log('🌱 En el próximo deploy se poblará la base de datos con:');
  console.log('   - Estados iniciales');
  console.log('   - Tipos de empresa');
  console.log('   - Tipos de mercadería');
} else {
  console.log('❌ POPULATE_DB deshabilitado');
  console.log('🚀 En el próximo deploy solo se ejecutarán las migraciones');
}

console.log('');
console.log('📝 Para aplicar este cambio en Render:');
console.log('   1. Ve a tu dashboard de Render');
console.log('   2. Selecciona tu servicio');
console.log('   3. Ve a "Environment"');
console.log('   4. Agrega/modifica la variable POPULATE_DB');
console.log(`   5. Establece el valor como: ${newValue}`);
console.log('   6. Haz redeploy del servicio');
console.log('');
console.log('⚠️  IMPORTANTE: Solo habilita POPULATE_DB=true cuando necesites');
console.log('   poblar una base de datos nueva o vacía. En deploys normales');
console.log('   debe estar en false para evitar duplicar datos.');
