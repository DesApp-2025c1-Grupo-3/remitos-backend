const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mercaderia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // No association needed here
    }
  }
  Mercaderia.init(
    {
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
