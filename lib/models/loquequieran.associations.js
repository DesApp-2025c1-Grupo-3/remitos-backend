import Compra from './compras';
import Producto from './productos';

export default function injectAssociations() {
  Compra.belongsTo(Producto);
  Producto.hasMany(Compra, { as: 'Compras' });
}
