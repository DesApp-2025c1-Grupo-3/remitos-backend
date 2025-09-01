const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mercaderia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mercaderia.belongsTo(models.TipoMercaderia, {
        foreignKey: "tipoMercaderiaId",
        as: "tipoMercaderia"
      }),
      Mercaderia.belongsTo(models.Remito,{
        foreignKey: "remitoId",
        as: "remito"
      })
    }
  }
  Mercaderia.init(
    {
      tipoMercaderiaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TipoMercaderias',
          key: 'id'
        }
      },
      valorDeclarado: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      volumenMetrosCubico: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      pesoMercaderia: {
        type: DataTypes.BIGINT,
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
      remitoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Remitos',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: "Mercaderia",
    }
  );
  return Mercaderia;
};
