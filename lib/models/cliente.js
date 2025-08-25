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
      Cliente.hasMany(models.Remito, {
        foreignKey: "clienteId",
        as: "remitos",
      });
      Cliente.hasMany(models.Contacto, {
        foreignKey: "clienteId",
        as: "contactos",
      });
      Cliente.belongsTo(models.TipoEmpresa, { foreignKey: 'tipoEmpresaId', as: 'tipoEmpresa' });
    }
  }
  Cliente.init(
    {
      razonSocial: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cuit_rut: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipoEmpresaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'TipoEmpresas',
          key: 'id'
        }
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Cliente",
    }
  );
  return Cliente;
};
