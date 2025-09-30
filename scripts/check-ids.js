#!/usr/bin/env node

/**
 * Script para verificar los IDs generados en la base de datos
 * Muestra la secuencia de IDs para identificar problemas de numeración
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

async function checkIds() {
  try {
    console.log('🔍 Verificando IDs en la base de datos...\n');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida\n');

    // Consultar todas las entidades
    const clientes = await Cliente.findAll({
      attributes: ['id', 'razonSocial'],
      order: [['id', 'ASC']]
    });

    const destinos = await Destino.findAll({
      attributes: ['id', 'nombre'],
      order: [['id', 'ASC']]
    });

    const remitos = await Remito.findAll({
      attributes: ['id', 'numeroAsignado'],
      order: [['id', 'ASC']]
    });

    const mercaderias = await Mercaderia.findAll({
      attributes: ['id', 'remitoId', 'valorDeclarado'],
      order: [['id', 'ASC']]
    });

    const contactos = await Contacto.findAll({
      attributes: ['id', 'clienteId', 'destinoId', 'personaAutorizada'],
      order: [['id', 'ASC']]
    });

    const estados = await Estado.findAll({
      attributes: ['id', 'nombre'],
      order: [['id', 'ASC']]
    });

    const tipoEmpresas = await TipoEmpresa.findAll({
      attributes: ['id', 'nombre'],
      order: [['id', 'ASC']]
    });

    const tipoMercaderias = await TipoMercaderia.findAll({
      attributes: ['id', 'nombre'],
      order: [['id', 'ASC']]
    });

    // Función para analizar secuencia de IDs
    function analyzeIdSequence(entities, entityName) {
      console.log(`📊 ${entityName.toUpperCase()}:`);
      console.log(`   Total: ${entities.length}`);
      
      if (entities.length === 0) {
        console.log('   ⚠️ No hay datos\n');
        return;
      }

      const ids = entities.map(e => e.id);
      const minId = Math.min(...ids);
      const maxId = Math.max(...ids);
      
      console.log(`   ID mínimo: ${minId}`);
      console.log(`   ID máximo: ${maxId}`);
      console.log(`   Rango esperado: 1-${entities.length}`);
      
      // Verificar secuencia
      const expectedIds = Array.from({length: entities.length}, (_, i) => i + 1);
      const missingIds = expectedIds.filter(id => !ids.includes(id));
      const extraIds = ids.filter(id => !expectedIds.includes(id));
      
      if (missingIds.length > 0) {
        console.log(`   ❌ IDs faltantes: ${missingIds.join(', ')}`);
      }
      
      if (extraIds.length > 0) {
        console.log(`   ❌ IDs extra: ${extraIds.join(', ')}`);
      }
      
      if (missingIds.length === 0 && extraIds.length === 0) {
        console.log(`   ✅ Secuencia correcta`);
      }
      
      console.log(`   Primeros 5 IDs: ${ids.slice(0, 5).join(', ')}`);
      if (ids.length > 5) {
        console.log(`   Últimos 5 IDs: ${ids.slice(-5).join(', ')}`);
      }
      console.log('');
    }

    // Analizar cada entidad
    analyzeIdSequence(estados, 'Estados');
    analyzeIdSequence(tipoEmpresas, 'Tipos de Empresa');
    analyzeIdSequence(tipoMercaderias, 'Tipos de Mercadería');
    analyzeIdSequence(clientes, 'Clientes');
    analyzeIdSequence(destinos, 'Destinos');
    analyzeIdSequence(remitos, 'Remitos');
    analyzeIdSequence(mercaderias, 'Mercaderías');
    analyzeIdSequence(contactos, 'Contactos');

    // Verificar relaciones
    console.log('🔗 VERIFICACIÓN DE RELACIONES:');
    
    // Clientes con contactos
    const clientesConContactos = await Contacto.findAll({
      where: { clienteId: { [sequelize.Sequelize.Op.ne]: null } },
      attributes: ['clienteId'],
      group: ['clienteId'],
      raw: true
    });
    console.log(`   Clientes con contactos: ${clientesConContactos.length}/${clientes.length}`);
    
    // Destinos con contactos
    const destinosConContactos = await Contacto.findAll({
      where: { destinoId: { [sequelize.Sequelize.Op.ne]: null } },
      attributes: ['destinoId'],
      group: ['destinoId'],
      raw: true
    });
    console.log(`   Destinos con contactos: ${destinosConContactos.length}/${destinos.length}`);
    
    // Remitos con mercaderías
    const remitosConMercaderias = await Mercaderia.findAll({
      where: { remitoId: { [sequelize.Sequelize.Op.ne]: null } },
      attributes: ['remitoId'],
      group: ['remitoId'],
      raw: true
    });
    console.log(`   Remitos con mercaderías: ${remitosConMercaderias.length}/${remitos.length}`);
    
    // Verificar si hay remitos sin mercaderías
    const remitosSinMercaderias = remitos.filter(r => 
      !mercaderias.some(m => m.remitoId === r.id)
    );
    if (remitosSinMercaderias.length > 0) {
      console.log(`   ⚠️ Remitos sin mercaderías: ${remitosSinMercaderias.map(r => r.numeroAsignado).join(', ')}`);
    }

    console.log('\n🎯 RESUMEN:');
    console.log(`   • ${estados.length} Estados`);
    console.log(`   • ${tipoEmpresas.length} Tipos de Empresa`);
    console.log(`   • ${tipoMercaderias.length} Tipos de Mercadería`);
    console.log(`   • ${clientes.length} Clientes`);
    console.log(`   • ${destinos.length} Destinos`);
    console.log(`   • ${remitos.length} Remitos`);
    console.log(`   • ${mercaderias.length} Mercaderías`);
    console.log(`   • ${contactos.length} Contactos`);

  } catch (error) {
    console.error('❌ Error al verificar IDs:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
if (require.main === module) {
  checkIds()
    .then(() => {
      console.log('\n✨ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { checkIds };




