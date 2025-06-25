"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si ya existen estados para evitar duplicados
    const existingStates = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM "Estados"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingStates[0].count === "0") {
      // Insertar estados iniciales en el orden correcto
      // Es importante que "Autorizado" tenga id=1 porque se hardcodea en el controlador
      await queryInterface.bulkInsert(
        "Estados",
        [
          {
            id: 1,
            descripcion: "Autorizado",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            descripcion: "Retenido",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            descripcion: "En preparación",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 4,
            descripcion: "En carga",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 5,
            descripcion: "En camino",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 6,
            descripcion: "No entregado",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 7,
            descripcion: "Entregado",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );

      // Reiniciar la secuencia del autoincrement para que continúe desde 8
      await queryInterface.sequelize.query(
        "SELECT setval('\"Estados_id_seq\"', 7, true)",
        { type: Sequelize.QueryTypes.SELECT }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar todos los estados insertados por este seeder
    await queryInterface.bulkDelete(
      "Estados",
      {
        descripcion: {
          [Sequelize.Op.in]: [
            "Autorizado",
            "Retenido",
            "En preparación",
            "En carga",
            "En camino",
            "No entregado",
            "Entregado",
          ],
        },
      },
      {}
    );
  },
};
