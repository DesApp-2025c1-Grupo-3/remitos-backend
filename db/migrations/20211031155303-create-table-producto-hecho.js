'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // acá cambiar el nombre de la tabla
    await queryInterface.createTable('ProductoHecho', {

      // id - este no se toca
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // acá poner los atributos definidos en la clase del modelo
      codigo: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      precio: {
        // en los números creo que conviene especificar 
        // cantidad de posiciones enteras y decimales
        type: Sequelize.DECIMAL(20,2)
      },
      proveedor: {
        type: Sequelize.STRING
      },

      // timestamp de creación y última modificación - estos no se tocan
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // acá cambiar el nombre de la tabla
    await queryInterface.dropTable('ProductoHecho');
  }
};
