'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoMercaderia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TipoMercaderia.hasMany(models.Mercaderia, {
        foreignKey: 'tipoMercaderiaId',
        as: 'mercaderia',
      });
    }
  };
  TipoMercaderia.init({
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TipoMercaderia',
  });
  return TipoMercaderia;
};