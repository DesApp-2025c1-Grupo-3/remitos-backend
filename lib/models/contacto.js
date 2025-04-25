"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contacto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contacto.belongsTo(models.Cliente, {
        foreignKey: "ClienteId",
        as: "cliente",
      }),
        Contacto.belongsTo(models.Destino, {
          foreignKey: "DestinoId",
          as: "destino",
        });
    }
  }
  Contacto.init(
    {
      personaAutorizada: DataTypes.STRING,
      correoElectronico: DataTypes.STRING,
      telefono: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Contacto",
    }
  );
  return Contacto;
};
