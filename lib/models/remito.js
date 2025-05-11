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
        foreignKey: {
          name: "clienteId",
          allowNull: true,
        },
        as: "cliente",
      }),
        Remito.belongsTo(models.Destino, {
          foreignKey: { name: "destinoId", allowNull: true },
          as: "destino",
        }),
        Remito.belongsTo(models.Estado, {
          foreignKey: {
            name: "estadoId",
            allowNull: true,
          },
          as: "estado",
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
      cantidadBobinas: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cantidadRacks: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cantidadBultos: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cantidadPallets: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      requisitosEspeciales: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      observaciones: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      archivoAdjunto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clienteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      destinoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estadoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Remito",
    }
  );
  return Remito;
};
