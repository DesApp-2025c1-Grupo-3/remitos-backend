"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Remitos", {
      fields: ["numeroAsignado"],
      type: "unique",
      name: "remitos_numero_asignado_unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "Remitos",
      "remitos_numero_asignado_unique"
    );
  },
};
