"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Estado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Estado.hasMany(models.Remito, {
        foreignKey: "estadoId",
        as: "estados",
      });
    }
  }
  Estado.init(
    {
      descripcion: DataTypes.STRING,
      /* activo: {
        type: DataTypes.BOOLEAN,            // Si se quiere tener un campo activo o no, para eliminarlo
        defaultValue: true,
      },*/
    },
    {
      sequelize,
      modelName: "Estado",
    }
  );
  return Estado;
};