'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoEmpresa extends Model {
    static associate(models) {
      TipoEmpresa.hasMany(models.Cliente, {
        foreignKey: 'tipoEmpresaId',
        as: 'clientes',
      });
    }
  };
  
  TipoEmpresa.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'TipoEmpresa',
    tableName: 'TipoEmpresas'
  });
  
  return TipoEmpresa;
};
