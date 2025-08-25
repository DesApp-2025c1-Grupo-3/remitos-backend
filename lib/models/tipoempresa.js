'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoEmpresa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TipoEmpresa.hasMany(models.Cliente, {
        foreignKey: 'tipoEmpresaId',
        as: 'clientes',
      });
    }
  };
  TipoEmpresa.init({
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TipoEmpresa',
  });
  return TipoEmpresa;
};