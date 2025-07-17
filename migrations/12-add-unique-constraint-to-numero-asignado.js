"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addConstraint("Remitos", {
        fields: ["numeroAsignado"],
        type: "unique",
        name: "remitos_numero_asignado_unique",
      });
    } catch (error) {
      // Si la restricción ya existe, ignorar el error
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint(
        "Remitos",
        "remitos_numero_asignado_unique"
      );
    } catch (error) {
      // Si la restricción no existe, ignorar el error
      if (!error.message.includes("does not exist")) {
        throw error;
      }
    }
  },
};
