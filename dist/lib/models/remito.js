"use strict";

const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Remito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Remito.belongsTo(models.Cliente, {
        foreignKey: "clienteId",
        as: "cliente"
      }), Remito.belongsTo(models.Destino, {
        foreignKey: "destinoId",
        as: "destino"
      }), Remito.belongsTo(models.Estado, {
        foreignKey: "estadoId",
        as: "estado"
      });
      Remito.belongsTo(models.Mercaderia, {
        foreignKey: "mercaderiaId",
        as: "mercaderia"
      });
    }

  }

  Remito.init({
    numeroAsignado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaEmision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true
    },
    archivoAdjunto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    prioridad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    destinoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estadoId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mercaderiaId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: "Remito"
  });
  return Remito;
};
//# sourceMappingURL=remito.js.map