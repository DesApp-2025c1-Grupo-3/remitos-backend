#!/usr/bin/env node

/**
 * Script para arreglar la secuencia de IDs de Estados
 * Mueve todos los estados para que empiecen desde ID 1
 */

const { sequelize, Estado } = require('../lib/models');

async function fixEstadosSequence() {
  try {
    console.log('🔧 Arreglando secuencia de IDs de Estados...\n');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida\n');

    // Iniciar transacción
    const transaction = await sequelize.transaction();

    try {
      // Obtener todos los estados actuales
      const estadosActuales = await Estado.findAll({
        order: [['id', 'ASC']],
        transaction
      });

      console.log('📊 Estados actuales:');
      estadosActuales.forEach(estado => {
        console.log(`   ID ${estado.id}: ${estado.nombre}`);
      });

      // Crear tabla temporal para mapear IDs antiguos a nuevos
      const mapeoIds = {};
      estadosActuales.forEach((estado, index) => {
        const nuevoId = index + 1;
        mapeoIds[estado.id] = nuevoId;
        console.log(`   ID ${estado.id} → ${nuevoId}: ${estado.nombre}`);
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
      for (const [idAntiguo, idNuevo] of Object.entries(mapeoIds)) {
        const estado = estadosActuales.find(e => e.id === parseInt(idAntiguo));
        await Estado.create({
          id: parseInt(idNuevo),
          nombre: estado.nombre,
          descripcion: estado.descripcion
        }, { transaction });
        console.log(`   ✅ ID ${idNuevo}: ${estado.nombre}`);
      }

      // Paso 6: Volver a habilitar las foreign key constraints
      console.log('\n🔒 Rehabilitando foreign key constraints...');
      await sequelize.query('SET session_replication_role = DEFAULT;', { transaction });
      console.log('   ✅ Foreign key constraints rehabilitadas');

      // Paso 7: Resetear la secuencia
      console.log('\n🔄 Reseteando secuencia de Estados...');
      await sequelize.query(
        `ALTER SEQUENCE "Estados_id_seq" RESTART WITH ${estadosActuales.length + 1}`,
        { transaction }
      );
      console.log(`   ✅ Secuencia resetada a ${estadosActuales.length + 1}`);

      // Confirmar transacción
      await transaction.commit();
      console.log('\n🎉 ¡Secuencia de Estados arreglada exitosamente!');

      // Verificar resultado
      console.log('\n📊 Estados después del arreglo:');
      const estadosFinales = await Estado.findAll({ order: [['id', 'ASC']] });
      estadosFinales.forEach(estado => {
        console.log(`   ID ${estado.id}: ${estado.nombre}`);
      });

    } catch (error) {
      // Revertir transacción en caso de error
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('❌ Error al arreglar secuencia de Estados:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
if (require.main === module) {
  fixEstadosSequence()
    .then(() => {
      console.log('\n✨ Arreglo completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { fixEstadosSequence };
