'use strict';

// me inspiré en 
// https://medium.com/@andrewoons/how-to-define-sequelize-associations-using-migrations-de4333bf75a7

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'CompraHecho',
      'ProductoHechoId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProductoHecho',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: '',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'CompraHecho', // name of Source model
      'ProductoHechoId' // key we want to remove
    );
  }
};
