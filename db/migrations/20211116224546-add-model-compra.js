'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // acá cambiar el nombre de la tabla
    await queryInterface.createTable('Compra', {

      // id - este no se toca
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // acá poner los atributos definidos en la clase del modelo
      /*

                proveedor: DataTypes.STRING,
                fecha: DataTypes.DATEONLY,
                precio: DataTypes.NUMBER,
                cantidad: DataTypes.NUMBER,


       */
      proveedor: {
        type: Sequelize.STRING
      },
      fecha: {
        type: Sequelize.DATEONLY
      },
      precio: {
        type: Sequelize.DECIMAL(20, 2)
      },
      cantidad: {
        type: Sequelize.DECIMAL(14, 2)
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
    await queryInterface.dropTable('Compra');
  }
};
