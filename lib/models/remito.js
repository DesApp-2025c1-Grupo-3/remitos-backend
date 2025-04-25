"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Remito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Remito.belongsTo(models.Cliente, {
        foreignKey: "ClienteId",
        as: "cliente",
      }),
        Remito.belongsTo(models.Destino, {
          foreignKey: "DestinoId",
          as: "destino",
        });
    }
  }
  Remito.init(
    {
      numeroAsignado: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipoMercaderia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valorDeclarado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      volumenMetrosCubico: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pesoMercaderia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaEmision: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      cantidadBobinas: DataTypes.INTEGER,
      cantidadRacks: DataTypes.INTEGER,
      cantidadBultos: DataTypes.INTEGER,
      cantidadPallets: DataTypes.INTEGER,
      requisitosEspeciales: DataTypes.STRING,
      observaciones: DataTypes.STRING,
      archivoAdjunto: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Remito",
    }
  );
  return Remito;
};
