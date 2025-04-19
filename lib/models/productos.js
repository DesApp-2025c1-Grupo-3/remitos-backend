import { Model, DataTypes } from 'sequelize';

export default class Producto extends Model {
    static init(sequelize) {
        return super.init(
            // columnas que va a tener la tabla
            {
                codigo: DataTypes.STRING,
                nombre: DataTypes.STRING,
                precio: DataTypes.NUMBER,
                proveedor: DataTypes.STRING,
            },
            // opciones
            {
                sequelize,
                // nombre de la tabla
                tableName: 'Producto',
                // esto no sé si sirve, si se seteó tableName
                modelName: 'Producto',
            }
        );
    }
}
