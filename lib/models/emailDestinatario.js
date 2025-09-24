"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmailDestinatario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // No hay asociaciones directas por ahora
    }
  }
  EmailDestinatario.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nombre opcional del destinatario'
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "EmailDestinatario",
    }
  );
  return EmailDestinatario;
};
