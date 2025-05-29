"use strict";

const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Contacto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contacto.belongsTo(models.Cliente, {
        foreignKey: "clienteId",
        as: "cliente"
      }), Contacto.belongsTo(models.Destino, {
        foreignKey: "destinoId",
        as: "destino"
      });
    }

  }

  Contacto.init({
    personaAutorizada: DataTypes.STRING,
    //Falta activo
    correoElectronico: DataTypes.STRING,
    telefono: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: "Contacto"
  });
  return Contacto;
};
//# sourceMappingURL=contacto.js.map