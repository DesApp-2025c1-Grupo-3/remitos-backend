#!/usr/bin/env node

/**
 * Script mejorado para resetear la secuencia de Estados
 * Siempre asegura que los estados empiecen desde ID 1
 */

const { sequelize, Estado } = require('../lib/models');

async function resetEstadosSequence() {
  try {
    console.log('🔧 Reseteando secuencia de Estados para que empiecen desde ID 1...\n');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida\n');

    // Iniciar transacción
    const transaction = await sequelize.transaction();

    try {
      // Obtener todos los estados actuales ordenados por nombre para mantener consistencia
      const estadosActuales = await Estado.findAll({
        order: [['nombre', 'ASC']],
        transaction
      });

      if (estadosActuales.length === 0) {
        console.log('⚠️ No hay estados para resetear');
        await transaction.commit();
        return;
      }

      console.log('📊 Estados actuales:');
      estadosActuales.forEach(estado => {
        console.log(`   ID ${estado.id}: ${estado.nombre}`);
      });

      // Definir el orden correcto de estados (importante para el negocio)
      const ordenCorrecto = [
        'Autorizado',     // ID 1 - Estado inicial
        'En preparación', // ID 2
        'En carga',       // ID 3
        'En camino',      // ID 4
        'Agendado',       // ID 5
        'Retenido',       // ID 6
        'Entregado',      // ID 7
        'No entregado'    // ID 8
      ];

      // Crear tabla temporal para mapear IDs antiguos a nuevos
      const mapeoIds = {};
      const estadosReordenados = [];

      // Reordenar estados según el orden correcto
      ordenCorrecto.forEach((nombreEstado, index) => {
        const estado = estadosActuales.find(e => e.nombre === nombreEstado);
        if (estado) {
          const nuevoId = index + 1;
          mapeoIds[estado.id] = nuevoId;
          estadosReordenados.push({
            ...estado.toJSON(),
            nuevoId: nuevoId
          });
          console.log(`   ${estado.nombre}: ID ${estado.id} → ${nuevoId}`);
        }
      });

      // Agregar estados que no están en el orden correcto (por si acaso)
      estadosActuales.forEach(estado => {
        if (!ordenCorrecto.includes(estado.nombre)) {
          const nuevoId = estadosReordenados.length + 1;
          mapeoIds[estado.id] = nuevoId;
          estadosReordenados.push({
            ...estado.toJSON(),
            nuevoId: nuevoId
          });
          console.log(`   ${estado.nombre}: ID ${estado.id} → ${nuevoId} (orden adicional)`);
        }
      });

      // Paso 1: Deshabilitar temporalmente las foreign key constraints
      console.log('\n🔓 Deshabilitando foreign key constraints...');
      await sequelize.query('SET session_replication_role = replica;', { transaction });
      console.log('   ✅ Foreign key constraints deshabilitadas');

      // Paso 2: Actualizar todos los remitos que referencian estos estados
      console.log('\n🔄 Actualizando referencias en tabla Remitos...');
      for (const [idAntiguo, idNuevo] of Object.entries(mapeoIds)) {
        if (idAntiguo !== idNuevo) {
          await sequelize.query(
            `UPDATE "Remitos" SET "estadoId" = ${idNuevo} WHERE "estadoId" = ${idAntiguo}`,
            { transaction }
          );
          await sequelize.query(
            `UPDATE "Remitos" SET "estadoAnteriorId" = ${idNuevo} WHERE "estadoAnteriorId" = ${idAntiguo}`,
            { transaction }
          );
          console.log(`   ✅ Remitos: ID ${idAntiguo} → ${idNuevo}`);
        }
      }

      // Paso 3: Actualizar todas las mercaderías que referencian estos estados
      console.log('\n🔄 Actualizando referencias en tabla Mercaderia...');
      for (const [idAntiguo, idNuevo] of Object.entries(mapeoIds)) {
        if (idAntiguo !== idNuevo) {
          await sequelize.query(
            `UPDATE "Mercaderia" SET "estadoId" = ${idNuevo} WHERE "estadoId" = ${idAntiguo}`,
            { transaction }
          );
          console.log(`   ✅ Mercadería: ID ${idAntiguo} → ${idNuevo}`);
        }
      }

      // Paso 4: Eliminar todos los estados actuales
      console.log('\n🗑️ Eliminando estados actuales...');
      await Estado.destroy({ where: {}, transaction });
      console.log('   ✅ Estados eliminados');

      // Paso 5: Recrear los estados con IDs correctos
      console.log('\n➕ Recreando estados con IDs correctos...');
      for (const estado of estadosReordenados) {
        await Estado.create({
          id: estado.nuevoId,
          nombre: estado.nombre,
          descripcion: estado.descripcion,
          createdAt: estado.createdAt,
          updatedAt: new Date()
        }, { transaction });
        console.log(`   ✅ ID ${estado.nuevoId}: ${estado.nombre}`);
      }

      // Paso 6: Volver a habilitar las foreign key constraints
      console.log('\n🔒 Rehabilitando foreign key constraints...');
      await sequelize.query('SET session_replication_role = DEFAULT;', { transaction });
      console.log('   ✅ Foreign key constraints rehabilitadas');

      // Paso 7: Resetear la secuencia para que empiece desde el siguiente ID
      console.log('\n🔄 Reseteando secuencia de Estados...');
      await sequelize.query(
        `ALTER SEQUENCE "Estados_id_seq" RESTART WITH ${estadosReordenados.length + 1}`,
        { transaction }
      );
      console.log(`   ✅ Secuencia resetada a ${estadosReordenados.length + 1}`);

      // Confirmar transacción
      await transaction.commit();
      console.log('\n🎉 ¡Secuencia de Estados reseteada exitosamente!');

      // Verificar resultado
      console.log('\n📊 Estados después del reset:');
      const estadosFinales = await Estado.findAll({ order: [['id', 'ASC']] });
      estadosFinales.forEach(estado => {
        console.log(`   ID ${estado.id}: ${estado.nombre}`);
      });

      // Verificar que "Autorizado" esté en ID 1
      const estadoAutorizado = estadosFinales.find(e => e.nombre === 'Autorizado');
      if (estadoAutorizado && estadoAutorizado.id === 1) {
        console.log('\n✅ ¡Perfecto! El estado "Autorizado" está en ID 1');
      } else {
        console.log('\n⚠️ Advertencia: El estado "Autorizado" no está en ID 1');
      }

    } catch (error) {
      // Revertir transacción en caso de error
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('❌ Error al resetear secuencia de Estados:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
if (require.main === module) {
  resetEstadosSequence()
    .then(() => {
      console.log('\n✨ Reset completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { resetEstadosSequence };




