"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Destino extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Destino.hasMany(models.Remito, {
        foreignKey: "destinoId",
        as: "remitos",
      });
      Destino.hasMany(models.Contacto, {
        foreignKey: "destinoId",
        as: "contactos",
      });
    }
  }

  Destino.init(
    {
      nombre: DataTypes.STRING,
      pais: DataTypes.STRING,
      provincia: DataTypes.STRING,
      localidad: DataTypes.STRING,
      direccion: DataTypes.STRING,
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Destino",
    }
  );
  return Destino;
};
//# sourceMappingURL=destino.js.map
