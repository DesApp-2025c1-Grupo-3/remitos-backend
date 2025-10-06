"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si ya existen estados
    const existingEstados = await queryInterface.rawSelect('Estados', {
      where: {
        id: 1
      }
    }, ['id']);

    if (existingEstados) {
      console.log('ℹ️  Estados ya existen, omitiendo inserción');
      return;
    }

    console.log('🌱 Insertando estados iniciales...');
    
    // Primero resetear la secuencia para que empiece desde 1
    await queryInterface.sequelize.query('ALTER SEQUENCE "Estados_id_seq" RESTART WITH 1');
    
    await queryInterface.bulkInsert(
      "Estados",
      [
        {
          id: 1,
          nombre: "Autorizado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          nombre: "En preparación",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          nombre: "En carga",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          nombre: "En camino",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          nombre: "Entregado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          nombre: "No entregado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          nombre: "Retenido",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          nombre: "Agendado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    
    // Actualizar la secuencia para que el siguiente ID sea 9
    await queryInterface.sequelize.query('ALTER SEQUENCE "Estados_id_seq" RESTART WITH 9');
    
    console.log('✅ Estados iniciales insertados correctamente');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Estados", null, {});
    console.log('🗑️  Estados eliminados');
  },
};
