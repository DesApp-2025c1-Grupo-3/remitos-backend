const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TipoMercaderia extends Model {
    static associate(models) {
      TipoMercaderia.hasMany(models.Mercaderia, {
        foreignKey: "tipoMercaderiaId",
        as: "mercaderias"
      });
    }
  }
  TipoMercaderia.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: "TipoMercaderia",
      tableName: "TipoMercaderia"
    }
  );
  return TipoMercaderia;
}; 