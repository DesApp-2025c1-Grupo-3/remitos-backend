import { Model, DataTypes } from 'sequelize';

export default class Compra extends Model {
    static init(sequelize) {
        return super.init(
            // columnas que va a tener la tabla
            {
                proveedor: DataTypes.STRING,
                fecha: DataTypes.DATEONLY,
                precio: DataTypes.NUMBER,
                cantidad: DataTypes.NUMBER,
            },
            // opciones
            {
                sequelize,
                // nombre de la tabla
                tableName: 'Compra',
                // esto no sé si sirve, si se seteó tableName
                modelName: 'Compra',
            }
        );
    }
}
