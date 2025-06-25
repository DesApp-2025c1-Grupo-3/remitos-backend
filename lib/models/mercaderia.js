const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mercaderia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mercaderia.hasOne(models.Remito, {
        foreignKey: "mercaderiaId",
        as: "remito",
      });
    }
  }
  Mercaderia.init(
    {
      tipoMercaderia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valorDeclarado: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      volumenMetrosCubico: {
        type: DataTypes.DECIMAL(12, 3),
        allowNull: false,
      },
      pesoMercaderia: {
        type: DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      cantidadBobinas: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      cantidadRacks: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      cantidadBultos: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      cantidadPallets: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      requisitosEspeciales: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      estadoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Mercaderia",
    }
  );
  return Mercaderia;
};
