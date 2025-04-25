"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cliente.hasMany(
        models.Remito,
        {
          foreignKey: "ClienteId",
          as: "remitos",
        },
        Cliente.hasMany(models.Contacto, {
          foreignKey: "DestinoId",
          as: "contactos",
        })
      );
    }
  }
  Cliente.init(
    {
      razonSocial: DataTypes.STRING,
      cuit_rut: DataTypes.STRING,
      direccion: DataTypes.STRING,
      tipoEmpresa: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cliente",
    }
  );
  return Cliente;
};
